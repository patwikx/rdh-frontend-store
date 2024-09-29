export interface Billboard {
    id: string;
    label: string;
    imageUrl: string;
}

export interface Category {
    id: string;
    name: string;
    billboard: Billboard;
}

export interface Product {
    id: string;
    category: Category;
    itemDesc: string;
    name: string;
    price: string;
    isFeatured: boolean;
    size: Size;
    color: Color;
    images: Image[];
}

export interface Image {
    id: string;
    url: string;
}

export interface Size {
    id: string;
    name: string;
    value: string;
}

export interface Color {
    id: string;
    name: string;
    value: string;
}

export interface Order {
    id: string;
    storeId: string;
    isPaid: string;
    companyName: string;
    poNumber: string;
    contactNumber: string;
    address: string;
    createdAt: string;
    orderItems: OrderItem[];
}
export interface OrderItem {
    id: string;
    orderId: string;
    order: Order;
    productid: string;
    product: Product;
    quantity: string;
    totalItemAmount: number;
}