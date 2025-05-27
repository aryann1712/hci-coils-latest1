export interface ProductAllTypeInterfact {
    _id: string;
    category?: string;
    price?: number;
    name: string;
    sku: string;
    description: string;
    images: string[]
    sqmm?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
}


export const predefinedCategories = [
    "Open Type Old Model",
    "Custom coils",
    "Open Type Rg Model",
    "Open Type Rgs Model"
  ];