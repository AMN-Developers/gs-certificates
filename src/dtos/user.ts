export class UserDTO {
  private _userId: number;

  constructor(userId: number) {
    this._userId = userId;
  }

  get userId() {
    return this._userId;
  }

  static fromDb(userId: number) {
    return new UserDTO(userId);
  }
}
