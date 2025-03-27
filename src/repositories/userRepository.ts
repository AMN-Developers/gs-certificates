import { and, eq } from 'drizzle-orm';
import { users, tokenBalance } from '../lib/db/schema';
import type { DB } from '@/lib/db';
import { db } from '@/lib/db';
import type { IUsersRepository } from '.';

export type TokenType = 'higienizacao' | 'impermeabilizacao';

export class UsersRepository implements IUsersRepository {
  private db: DB;

  constructor(database?: DB) {
    this.db = database || db;
  }

  /**
   * Create a new user in the database
   */
  async createUser(userId: number): Promise<{ id: number }> {
    const [user] = await this.db
      .insert(users)
      .values({ id: userId })
      .returning();

    return user;
  }

  /**
   * Find a user by ID
   */
  async findById(userId: number): Promise<{ id: number }> {
    const [user] = await this.db
      .select({
        id: users.id,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return user;
  }

  /**
   * Find all token balances for a user
   */
  async findTokenBalancesByUserId(
    userId: number,
  ): Promise<{ type: string; balance: number }[]> {
    const balances = await this.db
      .select({
        type: tokenBalance.type,
        balance: tokenBalance.balance,
        userId: tokenBalance.userId,
      })
      .from(tokenBalance)
      .where(eq(tokenBalance.userId, userId));

    return balances;
  }

  /**
   * Find a specific token balance
   */
  async findTokenBalance(
    userId: number,
    type: TokenType,
  ): Promise<{ userId: number; type: string; balance: number }> {
    const [balance] = await this.db
      .select({
        type: tokenBalance.type,
        balance: tokenBalance.balance,
        userId: tokenBalance.userId,
      })
      .from(tokenBalance)
      .where(and(eq(tokenBalance.userId, userId), eq(tokenBalance.type, type)))
      .limit(1);

    return balance;
  }

  /**
   * Create a new token balance
   */
  async createTokenBalance(
    userId: number,
    type: TokenType,
    balance: number,
  ): Promise<void> {
    await this.db.insert(tokenBalance).values({
      userId,
      type,
      balance,
    });
  }

  /**
   * Update an existing token balance
   */
  async updateTokenBalance(
    userId: number,
    type: TokenType,
    balance: number,
  ): Promise<void> {
    await this.db
      .update(tokenBalance)
      .set({ balance })
      .where(and(eq(tokenBalance.userId, userId), eq(tokenBalance.type, type)));
  }
}
