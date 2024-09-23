"use client";

import { Product } from "@/types";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Label } from "./ui/label";
import Currency from "@/components/ui/currency";
import Container from "@/components/ui/container";
import Image from "next/image";
import useCart from "@/hooks/use-cart";
import { useState } from "react";
import { Button } from "./ui/button";

interface CartItemsProps {
  data: Product;
}

const HoverItems: React.FC<CartItemsProps> = ({ data }) => {

  const cart= useCart();
  const item = cart.items.find((item) => item.id === data.id);
  const [quantity, setQuantity] = useState(item?.quantity || 0);

  return (
    <div>
    <Container>
      {/* Flex container to align avatar, name, and price */}
      <div className="flex items-center gap-4 space-y-4">
        {/* Avatar */}
        
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
           {/* Product price */}
           <Label className="ml-4">({item?.quantity})</Label>
          {/* Product price */}
          <div className="ml-8">
            <Currency value={data.price} />
          </div>
        </div>
      </div>
    </Container>
    </div>
    
  );
};

export default HoverItems;
