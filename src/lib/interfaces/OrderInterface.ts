export interface ProductType {
    _id: string;
    name: string;
    description: string;
    sku: string;
    imageUrl?: string;
}

export interface CartItemType {
    product: ProductType;
    quantity: number;
}

export interface CustomCoilItemType {
    coilType: string;
    height: string;
    length: string;
    rows: string;
    fpi: string;
    endplateType: string;
    circuitType: string;
    numberOfCircuits: string;
    headerSize: string;
    tubeType: string;
    finType: string;
    distributorHoles: string;
    distributorHolesDontKnow: boolean;
    inletConnection: string;
    inletConnectionDontKnow: boolean;
    quantity: number;
}

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
    enquiryId: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    user: {
        _id: string;
        name: string;
        email: string;
        companyName: string;
        gstNumber: string;
        address: string;
    };
    items: CartItemType[];
    customItems: CustomCoilItemType[];
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