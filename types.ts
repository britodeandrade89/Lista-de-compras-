
export interface ShoppingItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export interface Category {
  id: number;
  name: string;
  items: ShoppingItem[];
}

export interface Estimation {
  name: string;
  estimatedQuantity: number;
  unit: string;
}