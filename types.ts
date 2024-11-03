import { Decimal } from "@prisma/client/runtime/library";

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
    price: number;
    isFeatured: boolean;
    size: Size;
    color: Color;
    images: Image[];
    stock: number;
  discountPercentage?: number;
  rating?: number;
  createdAt: Date;
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
    orderStatus: boolean;
    companyName: string;
    poNumber: string;
    contactNumber: string;
    address: string;
    createdAt: string;
    deliveryMethod: string;
    orderItems: OrderItem[];
    shippingFee: Decimal;
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