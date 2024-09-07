"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MinusIcon, PlusIcon, X } from "lucide-react";
import IconButton from "@/components/ui/icon-button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { Product } from "@/types";

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
    <li className="flex py-6 border-b">
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
          <IconButton onClick={onRemove} icon={<X size={15} />} />
        </div>
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div className="flex justify-between">
            <p className="text-lg font-bold text-black mb-1">{data.name}</p>
          </div>
          <div className="mt-1 flex text-sm">
            <p className="text-gray-500">{data.color.name}</p>
            <p className="text-gray-500 ml-4 border-l border-gray-200 pl-4">
              {data.size.name}
            </p>
          </div>
          <Currency value={data.price} />
        </div>
        <div className="flex items-center gap-4">
            <label className="font-semibold text-black mr-4">Qty:</label>
          <IconButton onClick={incrementQuantity} icon={<PlusIcon size={15} />} />
          <input
            type="quantity"
            value={quantity}
            className="text-center font-semibold text-md border border-gray-300 rounded-md"
            size={5}
          />
          <IconButton onClick={decrementQuantity} icon={<MinusIcon size={15} />} />
        </div>
      </div>
    </li>
  );
};

export default CartItems;