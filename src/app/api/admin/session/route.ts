import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resolveDashboardAdminContext } from "@/app/dashboard/_admin-auth";
import { verifyAdminPassword } from "@/lib/admin-auth";
import { writeAdminAudit } from "@/lib/admin-audit";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import {
  bootstrapFirstAdmin,
  findActiveAdminByUsername,
} from "@/lib/admin-users";
import {
  consumeRateLimit,
  resetRateLimit,
  resolveClientIp,
} from "@/lib/rate-limit";
import { env } from "@/utils/env";

const schema = z.object({
  username: z.string().trim().min(1).max(80),
  password: z.string().min(1).max(256),
});

function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const publicOrigin = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

  return (
    Boolean(origin) &&
    (origin === request.nextUrl.origin || origin === publicOrigin)
  );
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { error: "Origem não autorizada." },
      { status: 403 },
    );
  }

  if (!env.ADMIN_SESSION_SECRET) {
    return NextResponse.json(
      { error: "O acesso administrativo não foi configurado." },
      { status: 503 },
    );
  }

  const key = "admin-login:" + resolveClientIp(request.headers);
  const rate = consumeRateLimit({
    key,
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });

  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Muitas tentativas. Aguarde 15 minutos." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } },
    );
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Usuário ou senha inválidos." },
      { status: 401 },
    );
  }

  await bootstrapFirstAdmin();
  const admin = await findActiveAdminByUsername(parsed.data.username);

  if (
    !admin ||
    !verifyAdminPassword(parsed.data.password, admin.passwordHash)
  ) {
    return NextResponse.json(
      { error: "Usuário ou senha inválidos." },
      { status: 401 },
    );
  }

  resetRateLimit(key);

  await db
    .update(adminUsers)
    .set({ lastLoginAt: new Date(), updatedAt: new Date() })
    .where(eq(adminUsers.id, admin.id));

  const token = jwt.sign(
    { purpose: "dashboard", role: admin.role },
    env.ADMIN_SESSION_SECRET,
    {
      algorithm: "HS256",
      issuer: "gs-certificates",
      audience: "dashboard",
      subject: String(admin.id),
      expiresIn: "8h",
      jwtid: randomUUID(),
    },
  );

  await writeAdminAudit({
    category: "authentication",
    event: "admin.login.succeeded",
    actorType: "admin",
    actorId: admin.id,
    actorLabel: admin.username,
    resourceType: "admin_user",
    resourceId: String(admin.id),
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set("admin_session", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 28800,
    path: "/",
  });
  return response;
}

export async function DELETE(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { error: "Origem não autorizada." },
      { status: 403 },
    );
  }

  const admin = await resolveDashboardAdminContext();

  await writeAdminAudit({
    category: "authentication",
    event: "admin.logout",
    actorType: "admin",
    actorId: admin?.id,
    actorLabel: admin?.actor ?? null,
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set("admin_session", "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
  return response;
}
