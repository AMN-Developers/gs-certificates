import { randomUUID } from 'node:crypto';
import { lt } from 'drizzle-orm';
import { db } from '@/lib/db';
import { systemLogs } from '@/lib/db/schema';

type AuditInput = {
  level?: 'info' | 'warning' | 'error';
  category?: 'authentication' | 'credits' | 'operational';
  event: string;
  actorType?: 'admin' | 'system';
  actorId?: number | null;
  actorLabel?: string | null;
  resourceType?: string | null;
  resourceId?: string | null;
  details?: Record<string, unknown>;
};

/**
 * Audit records must never make a successful business operation fail. The
 * database migration creates the table before this is enabled in production.
 */
export async function writeAdminAudit(input: AuditInput) {
  try {
    await db.insert(systemLogs).values({
      level: input.level ?? 'info',
      category: input.category ?? 'operational',
      event: input.event,
      correlationId: randomUUID(),
      actorType: input.actorType ?? 'system',
      actorId: input.actorId ?? null,
      actorLabel: input.actorLabel ?? null,
      resourceType: input.resourceType ?? null,
      resourceId: input.resourceId ?? null,
      details: input.details,
    });
  } catch (error) {
    // During rollout the audit migration may not have been applied yet.
    console.error('Unable to write administrative audit event', error);
  }
}

export async function removeExpiredAdminLogs(retentionDays = 180) {
  const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
  const result = await db
    .delete(systemLogs)
    .where(lt(systemLogs.createdAt, cutoff))
    .returning({ id: systemLogs.id });

  return result.length;
}
