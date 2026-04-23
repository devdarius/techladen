export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  price: {
    eur: number;
    aliexpressEur: number;
  };
  variants: {
    colors: string[];
    models: string[];
  };
  aliexpressProductId: string;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
  selectedModel?: string;
}
