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
  badge?: string | null;
  status: 'active' | 'draft' | 'trash';
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
  selectedModel?: string;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number; // 1-5
  title: string;
  text: string;
  date: string;
  verified: boolean;
  helpful: number;
  avatar?: string;
}
