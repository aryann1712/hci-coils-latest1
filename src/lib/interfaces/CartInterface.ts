export interface CartItemType {
  _id: string;
  sku: string;
  images: string[];
  name: string;
  category: string;
  description: string;
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



export interface FinalCartItem {
items: CartItemType[],
customCoils: CustomCoilItemType[]

}
