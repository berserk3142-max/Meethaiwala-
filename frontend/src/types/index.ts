// Sweet type definition
export interface Sweet {
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    description: string | null;
    imageUrl: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CartItem {
    sweet: Sweet;
    quantity: number;
}
