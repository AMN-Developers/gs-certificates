export class TokenBalanceDTO {
  private _userId: number;
  private _type: string;
  private _balance: number;

  constructor(userId: number, type: string, balance: number) {
    this._userId = userId;
    this._type = type;
    this._balance = balance;
  }

  get userId(): number {
    return this._userId;
  }

  get type(): string {
    return this._type;
  }

  get balance(): number {
    return this._balance;
  }

  static fromDb(data: {
    userId: number;
    type: string;
    balance: number;
  }): TokenBalanceDTO {
    return new TokenBalanceDTO(data.userId, data.type, data.balance);
  }

  toJSON(): Record<string, unknown> {
    return {
      userId: this._userId,
      type: this._type,
      balance: this._balance,
    };
  }
}
