"use client";

import { useEffect, useState } from "react";
import { MinusIcon, PlusIcon, ShoppingCart, Star, Truck, Shield } from "lucide-react";
import IconButton from "./ui/icon-button";
import Currency from "./ui/currency";
import useCart from "@/hooks/use-cart";
import { Product } from "@/types";
import { MouseEventHandler } from "react";
import { useRouter } from "next/navigation";
import { Label } from "./ui/label";
import { CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

interface InfoProps {
    data: Product;
}

const Info: React.FC<InfoProps> = ({ data }) => {
    const cart = useCart();
    const [quantity, setQuantity] = useState<number>(1);
    const router = useRouter();

    // Mock data for new features
    const rating = 4.5;
    const reviewCount = 128;
    const stockCount = 15;
    const shippingDate = new Date();
    shippingDate.setDate(shippingDate.getDate() + 2);

    useEffect(() => {
        const item = cart.items.find((item) => item.id === data.id);
        if (item) {
            setQuantity(item.quantity);
        } else {
            setQuantity(1);
        }
    }, [cart.items, data.id]);

    const handleClick = () => {
        router.push(`/product/${data?.id}`);
    };

    const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
        event.stopPropagation();
        cart.setTemporaryQuantity(quantity);
        cart.addItem(data);
        setQuantity(1);
    };

    const incrementQuantity = () => {
        setQuantity((prev) => Math.min(prev + 1, stockCount));
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{data.name}</h1>
            
            {/* Rating and reviews */}
            <div className="flex items-center mb-4">
                <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                    ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">{rating} ({reviewCount} reviews)</span>
            </div>

            <div className="flex items-center justify-between mb-6">
                <p className="text-3xl font-semibold text-gray-900">
                    <Currency value={data.price} />
                </p>
                <div className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    In Stock
                </div>
            </div>
        
            <hr className="my-6" />

            <div className="space-y-4">
                <div className="flex items-center gap-x-4">
                    <h3 className="text-sm font-medium text-gray-900">Size:</h3>
                    <div className="text-sm text-gray-700">{data?.size?.name}</div>
                </div>
                <div className="flex items-center gap-x-4">
                    <h3 className="text-sm font-medium text-gray-900">Color:</h3>
                    <div className="flex items-center gap-x-2">
                        <div
                            className="h-6 w-6 rounded-full border border-gray-300 shadow-sm"
                            style={{ backgroundColor: data?.color?.value }}
                        />
                        <span className="text-sm text-gray-700">{data?.color?.name}</span>
                    </div>
                </div>
                <div className="mt-4">
                    <Label className="text-sm font-medium text-gray-900">Description</Label>
                    <CardDescription className="mt-1 text-sm text-gray-500">{data?.itemDesc}</CardDescription>
                </div>


                <div className="mt-6">
                    <Label className="text-sm font-medium text-gray-900 mb-2 block">Quantity</Label>
                    <div className="flex items-center gap-x-3">
                        <IconButton onClick={decrementQuantity} icon={<MinusIcon size={15} />} className="border border-gray-300 rounded" />
                        <input
                            type="text"
                            value={quantity}
                            className="text-center font-semibold text-md border border-gray-300 rounded-md w-12 py-1"
                            readOnly
                        />
                        <IconButton onClick={incrementQuantity} icon={<PlusIcon size={15} />} className="border border-gray-300 rounded" />
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <Button onClick={onAddToCart} className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg flex items-center justify-center gap-x-2">
                    Add to Cart
                    <ShoppingCart size={20} />
                </Button>
            </div>

            {/* Product highlights */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Product Highlights</h3>
                <ul className="list-disc pl-5 space-y-2">
                    <li className="text-sm text-gray-600">Premium quality materials</li>
                    <li className="text-sm text-gray-600">Durable and long-lasting</li>
                    <li className="text-sm text-gray-600">Easy to clean and maintain</li>
                    <li className="text-sm text-gray-600">Versatile design for various uses</li>
                </ul>
            </div>

            {/* Warranty information */}
            <div className="mt-6 flex items-center">
                <Shield className="h-5 w-5 text-gray-400 mr-2" />
                <p className="text-sm text-gray-600">
                    2-year warranty included
                </p>
            </div>
        </div>
    );
};

export default Info;