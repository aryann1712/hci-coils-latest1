import { CartItemType } from "./CartInterface";

export interface OrderItemType {
    _id: string;
    user: {
      _id: string;
      name: string;
      email: string;
      gstNumber: string;
      companyName: string;
      address: string;
      role: string;
    };
    orderId: string;
    status: string;
    items: {
      product: CartItemType;
      quantity: number;
    }[];
    createdAt: string;
    updatedAt: string;
  }