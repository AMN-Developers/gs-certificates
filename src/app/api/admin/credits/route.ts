import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { resolveDashboardAdminContext } from "@/app/dashboard/_admin-auth";
import { db } from "@/lib/db";
import {
  systemLogs,
  tokenAdjustments,
  tokenBalance,
  users,
} from "@/lib/db/schema";
import { removeExpiredAdminLogs, writeAdminAudit } from "@/lib/admin-audit";

const certificateTypes = ["higienizacao", "impermeabilizacao"] as const;

const querySchema = z.object({
  userId: z.coerce.number().int().positive(),
});

const adjustmentSchema = z.object({
  userId: z.number().int().positive(),
  type: z.enum(certificateTypes),
  operation: z.enum(["add", "remove"]),
  amount: z.number().int().min(1).max(10000),
  reason: z.string().trim().min(3).max(300),
});

function unauthorized() {
  return NextResponse.json(
    { error: "Acesso administrativo necessário." },
    { status: 401 },
  );
}

function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const publicOrigin = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

  return (
    Boolean(origin) &&
    (origin === request.nextUrl.origin || origin === publicOrigin)
  );
}

export async function GET(request: NextRequest) {
  const admin = await resolveDashboardAdminContext();
  if (!admin) return unauthorized();

  const parsed = querySchema.safeParse({
    userId: request.nextUrl.searchParams.get("userId"),
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Informe um código de cliente válido." },
      { status: 400 },
    );
  }

  const userId = parsed.data.userId;
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!user)
    return NextResponse.json(
      { error: "Cliente não encontrado." },
      { status: 404 },
    );

  const [balances, adjustments] = await Promise.all([
    db
      .select({ type: tokenBalance.type, balance: tokenBalance.balance })
      .from(tokenBalance)
      .where(eq(tokenBalance.userId, userId)),
    db
      .select({
        id: tokenAdjustments.id,
        type: tokenAdjustments.type,
        amount: tokenAdjustments.amount,
        balanceBefore: tokenAdjustments.balanceBefore,
        balanceAfter: tokenAdjustments.balanceAfter,
        reason: tokenAdjustments.reason,
        adminActor: tokenAdjustments.adminActor,
        createdAt: tokenAdjustments.createdAt,
      })
      .from(tokenAdjustments)
      .where(eq(tokenAdjustments.userId, userId))
      .orderBy(desc(tokenAdjustments.createdAt))
      .limit(25),
  ]);

  return NextResponse.json({ userId, balances, adjustments });
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return NextResponse.json(
      { error: "Origem não autorizada." },
      { status: 403 },
    );
  }

  const admin = await resolveDashboardAdminContext();
  if (!admin) return unauthorized();

  const parsed = adjustmentSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados do ajuste inválidos." },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const signedAmount = input.operation === "add" ? input.amount : -input.amount;

  try {
    const adjustment = await db.transaction(async (transaction) => {
      // Serializes adjustments for the same client/type and prevents lost updates.
      const lockType = input.type === "higienizacao" ? 1 : 2;
      await transaction.execute(
        sql`SELECT pg_advisory_xact_lock(${input.userId}, ${lockType})`,
      );

      const [user] = await transaction
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, input.userId))
        .limit(1);
      if (!user) throw new Error("CLIENT_NOT_FOUND");

      const [current] = await transaction
        .select({ balance: tokenBalance.balance })
        .from(tokenBalance)
        .where(
          and(
            eq(tokenBalance.userId, input.userId),
            eq(tokenBalance.type, input.type),
          ),
        )
        .limit(1);

      const balanceBefore = current?.balance ?? 0;
      const balanceAfter = balanceBefore + signedAmount;
      if (balanceAfter < 0) throw new Error("NEGATIVE_BALANCE");

      if (current) {
        await transaction
          .update(tokenBalance)
          .set({ balance: balanceAfter })
          .where(
            and(
              eq(tokenBalance.userId, input.userId),
              eq(tokenBalance.type, input.type),
            ),
          );
      } else {
        await transaction.insert(tokenBalance).values({
          userId: input.userId,
          type: input.type,
          balance: balanceAfter,
        });
      }

      const [created] = await transaction
        .insert(tokenAdjustments)
        .values({
          userId: input.userId,
          type: input.type,
          amount: signedAmount,
          balanceBefore,
          balanceAfter,
          reason: input.reason,
          adminActor: admin.actor,
        })
        .returning();

      await transaction.insert(systemLogs).values({
        level: "info",
        category: "credits",
        event: "credits.adjusted",
        correlationId: crypto.randomUUID(),
        actorType: "admin",
        actorId: admin.id,
        actorLabel: admin.actor,
        resourceType: "user",
        resourceId: String(input.userId),
        details: {
          type: input.type,
          operation: input.operation,
          amount: signedAmount,
          balanceBefore,
          balanceAfter,
          reason: input.reason,
          adjustmentId: created.id,
        },
      });

      return created;
    });

    // Keeps the audit table bounded without a background service. It runs only
    // after an already successful, authenticated administrative operation.
    await removeExpiredAdminLogs();
    return NextResponse.json({ adjustment });
  } catch (error) {
    const code = error instanceof Error ? error.message : "UNKNOWN";
    if (code === "CLIENT_NOT_FOUND") {
      return NextResponse.json(
        { error: "Cliente não encontrado." },
        { status: 404 },
      );
    }
    if (code === "NEGATIVE_BALANCE") {
      return NextResponse.json(
        { error: "O saldo não pode ficar negativo." },
        { status: 422 },
      );
    }
    await writeAdminAudit({
      level: "error",
      category: "credits",
      event: "credits.adjustment_failed",
      actorType: "admin",
      actorId: admin.id,
      actorLabel: admin.actor,
      resourceType: "user",
      resourceId: String(input.userId),
      details: {
        type: input.type,
        operation: input.operation,
        amount: signedAmount,
      },
    });
    console.error("Unable to adjust certificate credits", error);
    return NextResponse.json(
      { error: "Não foi possível ajustar os créditos." },
      { status: 500 },
    );
  }
}
