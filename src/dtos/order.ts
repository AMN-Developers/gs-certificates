import { Order } from '@/utils/types';

export class OrderDTO {
  private _id: number;
  private _order_items: { product_id: number; quantity: number }[];

  constructor(
    id: number,
    order_items: { product_id: number; quantity: number }[],
  ) {
    this._id = id;
    this._order_items = order_items;
  }

  get id() {
    return this._id;
  }

  get order_items() {
    return this._order_items;
  }

  static fromDb(data: Order) {
    return new OrderDTO(data.id, data.order_items);
  }
}
