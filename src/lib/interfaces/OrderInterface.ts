import { CartItemType } from "./CartInterface";

export interface OrderItemType {
    orderId: string;
    orderDate: string;
    products: CartItemType[];
    userId: string;
    name: string;
    phone: string;
    gstNumber: string;
    companyName: string;
    address: string;
  }