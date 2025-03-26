export type TokenBalanceRecord = Record<string, number>;

export class UserDTO {
  private _id: number;
  private _tokenBalances: TokenBalanceRecord | null;
  private _createdAt?: Date;
  private _updatedAt?: Date;

  constructor(
    id: number,
    tokenBalances: TokenBalanceRecord | null = null,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this._id = id;
    this._tokenBalances = tokenBalances;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id(): number {
    return this._id;
  }

  get tokenBalances(): TokenBalanceRecord | null {
    return this._tokenBalances;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  static fromDb(
    id: number,
    tokenBalances?: TokenBalanceRecord | null,
    createdAt?: Date,
    updatedAt?: Date,
  ): UserDTO {
    return new UserDTO(id, tokenBalances || null, createdAt, updatedAt);
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      tokenBalances: this._tokenBalances,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
