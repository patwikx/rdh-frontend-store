"use client";

import { Product } from "@/types";
import Currency from "@/components/ui/currency";
import Container from "@/components/ui/container";
import Image from "next/image";
import useCart from "@/hooks/use-cart";
import { useState } from "react";
import { Label } from "./ui/label";

interface CartItemsProps {
  data: Product;
}

const HoverItems: React.FC<CartItemsProps> = ({ data }) => {
  const cart = useCart();
  const item = cart.items.find((item) => item.id === data.id);
  const [quantity, setQuantity] = useState<number>(item?.quantity || 0); // Explicitly typed as number

  // Calculate total price based on quantity, ensuring that quantity and price are numbers
  const totalPrice = item ? Number(item.quantity) * Number(data.price) : Number(data.price);

  return (
    <div>
      <Container>
        
        {/* Flex container to align avatar, name, and price */}
        <div className="flex items-center gap-4 space-y-4">
          {/* Product Image */}
          <Image
            src={data.images[0].url}
            alt={data.name}
            className="object-cover object-center"
            width={40}
            height={40}
          />

          {/* Name and price container */}
          <div className="flex justify-between items-center w-full">
            {/* Product name */}
            <Label>{data.name}</Label>

            {/* Product quantity */}
            <Label className="ml-4">({item?.quantity})</Label>

            {/* Total price (quantity * price) */}
            <div className="ml-8">
              <Currency value={totalPrice} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HoverItems;
