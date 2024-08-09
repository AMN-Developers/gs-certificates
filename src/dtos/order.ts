import { Order } from '@/utils/types';

export class OrderDTO {
  private _id: number;
  private _tokens: {
    [key: string]: number;
  };

  constructor(id: number, tokens: { [key: string]: number }) {
    this._id = id;
    this._tokens = tokens;
  }

  get id() {
    return this._id;
  }

  get tokens() {
    return this._tokens;
  }

  static fromDb(data: Order) {
    return new OrderDTO(data.id, data.tokens);
  }
}
