export interface ProductAllTypeInterfact {
    _id: string;
    category?: string;
    price?: number;
    name: string;
    sku: string;
    description: string;
    images: string[]
}


export const predefinedCategories = [
    "Open Type Old Model",
    "Custom coils",
    "Open Type Rg Model",
    "Open Type Rgs Model"
  ];