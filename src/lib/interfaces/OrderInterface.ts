import { CartItemType, CustomCoilItemType } from "./CartInterface";

export interface OrderItemType {
    _id: string;
    user: {
      _id: string;
      name?: string;
      phone?: string;
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
    customItems: CustomCoilItemType[],
    createdAt: string;
    updatedAt: string;
  }

export interface EnquiryItemType {
    _id: string;
    user: {
      _id: string;
      name?: string;
      phone?: string;
      email: string;
      gstNumber: string;
      companyName: string;
      address: string;
      role: string;
    };
    enquiryId: string;
    status: string;
    items: {
      product: CartItemType;
      quantity: number;
    }[];
    customItems: CustomCoilItemType[],
    createdAt: string;
    updatedAt: string;
  }


export interface EnquireItemType {
    _id: string;
    user: {
      _id: string;
      name?: string;
      phone?: string;
      email: string;
      gstNumber: string;
      companyName: string;
      address: string;
      role: string;
    };
    enquiryId: string;
    status: string;
    items: {
      product: CartItemType;
      quantity: number;
    }[];
    customItems: CustomCoilItemType[],
    createdAt: string;
    updatedAt: string;
  }