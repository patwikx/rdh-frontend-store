"use client";

import { useEffect, useState } from "react";
import { MinusIcon, PlusIcon, ShoppingCart } from "lucide-react";
import IconButton from "./ui/icon-button";
import Currency from "./ui/currency";
import useCart from "@/hooks/use-cart";
import { Product } from "@/types";
import { MouseEventHandler } from "react";
import { useRouter } from "next/navigation";
import { Label } from "./ui/label";
import { CardDescription } from "./ui/card";
import { Button } from "./ui/button";

interface InfoProps {
    data: Product;
}

const Info: React.FC<InfoProps> = ({ data }) => {
    const cart = useCart();
    const [quantity, setQuantity] = useState<number>(1); // Initialize quantity to 1
    const router = useRouter();

    // Sync local quantity state with cart item
    useEffect(() => {
        const item = cart.items.find((item) => item.id === data.id);
        if (item) {
            setQuantity(item.quantity);
        } else {
            setQuantity(1); // Reset quantity to 1 if item is not in the cart
        }
    }, [cart.items, data.id]);

    const handleClick = () => {
        router.push(`/product/${data?.id}`);
    };

    const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
        event.stopPropagation();
        cart.setTemporaryQuantity(quantity); // Set temporary quantity
        cart.addItem(data);
        setQuantity(1); // Reset quantity after adding to cart
    };

    const incrementQuantity = () => {
        setQuantity((prev) => prev + 1); // Update local state immediately
    };

    const decrementQuantity = () => {
        if (quantity > 1) { // Ensure quantity doesn't go below 1
            setQuantity((prev) => prev - 1); // Update local state immediately
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
            <div className="mt-3 items-end justify-between">
                <p className="text-2xl text-gray-900">
                    <Currency value={data.price} />
                </p>
            </div>
        
            <hr className="my-4" />
            <div>
                <div className="flex items-center gap-x-4">
                    <h3 className="font-semibold text-black">Size:</h3>
                    <div>{data?.size?.name}</div>
                </div>
                <div className="flex items-center gap-x-4">
                    <h3 className="font-semibold ">Color:</h3>
                    <div
                        className="h-6 w-6 rounded-full border border-gray-600"
                        style={{ backgroundColor: data?.color?.value }}
                    />
                </div>
                    <div className="mt-3">
                    <Label className="font-bold text-xs">Item Description</Label>
                    <CardDescription className="mt-1">{data?.itemDesc}</CardDescription>
                    </div>
                <div className="mt-12 flex flex-row items-center gap-x-3">
                    <label className="font-semibold text-black mr-4">Qty:</label>
                    
                    <IconButton onClick={decrementQuantity} icon={<MinusIcon size={15} />} />
                    <input
                        type="text"
                        value={quantity}
                        className="text-center font-semibold text-md border border-gray-300 rounded-md"
                        size={5}
                        readOnly
                    />
                    <IconButton onClick={incrementQuantity} icon={<PlusIcon size={15} />} />
                    <Button onClick={onAddToCart} className="flex items-center gap-x-2 ml-4">
                        Add to Cart
                        <ShoppingCart />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Info;