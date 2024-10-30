import { eq } from 'drizzle-orm';
import {
  users,
  certificateTokens as certificateTokensSchema,
} from '../lib/db/schema';
import type { DB } from '@/lib/db';
import { db } from '@/lib/db';
import { UserDTO } from '@/dtos/user';
import { IUsersRepository } from '.';

export class UsersRepository implements IUsersRepository {
  private db: DB;

  constructor() {
    this.db = db;
  }

  async createUserData(userData: UserDTO): Promise<UserDTO> {
    const [user] = await db
      .insert(users)
      .values({
        id: userData.userId,
      })
      .returning();

    return UserDTO.fromDb(user.id);
  }

  async updateUserCertificateToken(userData: {
    userId: number;
    certificateTokenId: number;
  }): Promise<UserDTO> {
    const { userId, certificateTokenId } = userData;

    await this.db
      .update(users)
      .set({
        certificateTokenId,
      })
      .where(eq(users.id, userId));

    return UserDTO.fromDb(userId);
  }

  async retrieveUserById(userData: UserDTO) {
    const { userId } = userData;

    const [user] = await this.db
      .select({
        id: users.id,
        certificateTokens: Object.keys(certificateTokensSchema).reduce(
          (acc, key) => ({
            ...acc,
            [key]:
              certificateTokensSchema[
                key as keyof typeof certificateTokensSchema
              ],
          }),
          {},
        ),
      })
      .from(users)
      .leftJoin(
        certificateTokensSchema,
        eq(users.certificateTokenId, certificateTokensSchema.id),
      )
      .where(eq(users.id, userId))
      .limit(1);

    return UserDTO.fromDb(user?.id as number, user?.certificateTokens);
  }

  async updateTokenQuantity(userData: {
    userId: number;
    certificateTokens: { [key: string]: number };
  }) {
    const { userId, certificateTokens } = userData;

    const [user] = await this.db
      .select({
        id: users.id,
        certificateTokenId: users.certificateTokenId,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new Error('User not found');
    }

    await this.db
      .update(certificateTokensSchema)
      .set({
        ...certificateTokens,
      })
      .where(eq(certificateTokensSchema.userId, userId));

    return UserDTO.fromDb(user.id);
  }
}
