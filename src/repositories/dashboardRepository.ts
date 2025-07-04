import { count, sql } from 'drizzle-orm';
import type { DB } from '@/lib/db';
import { db } from '@/lib/db';
import { certificates, users } from '@/lib/db/schema';
import { IDashboardRepository } from '.';

export class DashboardRepository implements IDashboardRepository {
  private db: DB;

  constructor() {
    this.db = db;
  }

  async getTotalCertificates(): Promise<number> {
    const result = await this.db.select({ count: count() }).from(certificates);

    return result[0]?.count || 0;
  }

  async getUniqueUsersWithCertificates(): Promise<number> {
    const result = await this.db
      .select({ count: count(sql`DISTINCT ${certificates.userId}`) })
      .from(certificates);

    return result[0]?.count || 0;
  }

  async getTotalUsers(): Promise<number> {
    const result = await this.db.select({ count: count() }).from(users);

    return result[0]?.count || 0;
  }
}
