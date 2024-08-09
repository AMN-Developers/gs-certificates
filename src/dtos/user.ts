export class UserDTO {
  private _userId: number;
  private _certificateTokens: { [key: string]: number } | undefined;

  constructor(userId: number, certificateTokens?: { [key: string]: number }) {
    this._userId = userId;
    this._certificateTokens = certificateTokens;
  }

  get userId() {
    return this._userId;
  }

  get certificateTokens() {
    return this._certificateTokens;
  }

  static fromDb(userId: number, certificateTokens?: { [key: string]: number }) {
    return new UserDTO(userId, certificateTokens);
  }
}
