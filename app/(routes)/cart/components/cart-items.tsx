"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MinusCircle, MinusIcon, PlusCircleIcon, PlusIcon, Trash, Trash2, X } from "lucide-react";
import IconButton from "@/components/ui/icon-button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { CardDescription } from "@/components/ui/card";
import Container from "@/components/ui/container";
import { Input } from "@/components/ui/input";

interface CartItemsProps {
  data: Product;
}


const CartItems: React.FC<CartItemsProps> = ({ data }) => {
  const cart = useCart();
  const item = cart.items.find((item) => item.id === data.id);
  const [quantity, setQuantity] = useState(item?.quantity || 0);

  useEffect(() => {
    if (item) {
      setQuantity(item.quantity);
    }
  }, [item]);

  const onRemove = () => {
    cart.removeItem(data.id);
  };

  const incrementQuantity = () => {
    cart.incrementQuantity(data.id);
  };

  const decrementQuantity = () => {
    cart.decrementQuantity(data.id);
  };

  return (
    <div>
    <Container>
    <li className="flex py-6 px-6 border-4 rounded-lg mt-2">
      <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48">
        <Image
          fill
          src={data.images[0].url}
          alt="Image"
          className="object-cover object-center"
        />
      </div>
      <div className="relative ml-4 flex flex-1 flex-col justify-between">
        <div className="absolute z-10 right-0 top-0">
          <IconButton onClick={onRemove} icon={<Trash2 size={15} color="red"/>} />
        </div>
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div className="flex justify-between">
            <p className="text-lg font-bold mb-1">{data.name}</p>
          </div>
          <div className="flex text-sm">
            <CardDescription className="mt-1">{data.color.name}</CardDescription>
              <Badge className="ml-4 border-l border-gray-200 pl-4">{data.size.name}</Badge>
          </div>
          <Currency value={data.price} />
        </div>
       
          <CardDescription className="text-sm font-light">{data.itemDesc}</CardDescription>
          
        <div className="flex flex-cols items-end gap-4 mt-4">
          <label className="font-semibold  mr-4">Qty:</label>
          <IconButton onClick={decrementQuantity} icon={<MinusCircle size={15} />} />
          <Input
            type="quantity"
            value={quantity}
            className="text-center font-semibold text-md border border-gray-300 rounded-md"
            size={1}
          />
          <IconButton onClick={incrementQuantity} icon={<PlusCircleIcon size={15} />} />
        </div>
      </div>
    </li>
    </Container>
    </div>
  );
};

export default CartItems;
