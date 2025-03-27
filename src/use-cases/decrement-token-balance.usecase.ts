import type { IUsersRepository } from '@/repositories';
import { UsersRepository } from '@/repositories/userRepository';

type DecrementTokenBalanceResult = {
  success: boolean;
  message: string;
  data?: {
    userId: number;
    type: string;
    balance: number;
  }[];
};

export class DecrementTokenBalanceUseCase {
  private userRepository: IUsersRepository;

  constructor() {
    this.userRepository = new UsersRepository();
  }

  async execute(
    userId: number,
    tokens: Record<string, number>,
  ): Promise<DecrementTokenBalanceResult> {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        return {
          success: false,
          message: `User with ID ${userId} not found`,
        };
      }

      const results = [];

      for (const [type, quantityToDecrement] of Object.entries(tokens)) {
        const tokenBalance = await this.userRepository.findTokenBalance(
          userId,
          type,
        );

        if (!tokenBalance) {
          return {
            success: false,
            message: `Token type ${type} not found for user ${userId}`,
          };
        }

        // Check if there are enough tokens to decrement
        if (tokenBalance.balance < quantityToDecrement) {
          return {
            success: false,
            message: `Insufficient token balance for user ${userId}: ${tokenBalance.balance} available, ${quantityToDecrement} requested for type ${type}`,
          };
        }

        // Calculate new balance by subtracting
        const updatedTokens = tokenBalance.balance - quantityToDecrement;

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

      return {
        success: true,
        message: 'Tokens decremented successfully',
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
