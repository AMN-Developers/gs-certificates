export type Order = {
  id: number;
  order_items: OrderItem[];
};

export type OrderItem = {
  order_id: number;
  product_id: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
};
