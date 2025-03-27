import type { IUsersRepository } from '@/repositories';
import { UsersRepository } from '@/repositories/userRepository';

type UpsertTokenBalanceResult = {
  success: boolean;
  message: string;
  data?: {
    userId: number;
    type: string;
    balance: number;
  }[];
};

export class UpsertTokenBalanceUseCase {
  private userRepository: IUsersRepository;

  constructor() {
    this.userRepository = new UsersRepository();
  }

  async execute(
    userId: number,
    tokens: Record<string, number>,
  ): Promise<UpsertTokenBalanceResult> {

    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        await this.userRepository.createUser(userId);
      }

      const results = [];

      for (const [type, balance] of Object.entries(tokens)) {
        const tokenBalance = await this.userRepository.findTokenBalance(
          userId,
          type,
        );

        if (!tokenBalance) {
          await this.userRepository.createTokenBalance(userId, type, balance);

          results.push({
            userId,
            type,
            balance,
          });
        } else {
          const updatedTokens = tokenBalance.balance + balance;

          await this.userRepository.updateTokenBalance(
            userId,
            type,
            updatedTokens,
          );

          results.push({
            userId,
            type,
            balance: updatedTokens,
          });
        }
      }

      return {
        success: true,
        message: 'Tokens processed successfully',
        data: results,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      };
    }
  }
}
