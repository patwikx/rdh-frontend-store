"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MinusCircle, PlusCircleIcon, Trash2 } from "lucide-react";
import IconButton from "@/components/ui/icon-button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { CardDescription } from "@/components/ui/card";
import Container from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertRemoveItem } from "@/components/ui/alert-remove";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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
    <Container>
      <li className="flex py-4 px-4 border-4 rounded-lg mt-2">
        <div className="relative h-16 w-16 overflow-hidden rounded-md">
          <Image
            fill
            src={data.images[0].url}
            alt="Image"
            className="object-cover object-center"
          />
        </div>
        <div className="relative ml-4 flex flex-1 flex-col justify-between">
          <div className="absolute z-10 right-0 top-0">
          <AlertDialog>
            <AlertDialogTrigger asChild>
                <IconButton 
                    icon={<Trash2 size={15} color="red" />} // Your Trash2 icon
                    className="hover:bg-red-100" // Optional styling
                />
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will remove the item on your shopping cart.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onRemove}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
          </div>
          <div className="pr-4">
            <p className="text-lg font-bold mb-1">{data.name}</p>
            <div className="flex text-sm">
              <CardDescription className="mt-1">{data.color.name}</CardDescription>
              <Badge className="ml-4 border-l border-gray-200 pl-4">{data.size.name}</Badge>
            </div>
            <Currency value={data.price} />
            <CardDescription className="text-sm font-light">{data.itemDesc}</CardDescription>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <label className="font-semibold">Qty:</label>
            <IconButton onClick={decrementQuantity} icon={<MinusCircle size={15} />} />
            <Input
              type="quantity"
              value={quantity}
              className="text-center font-semibold text-md border border-gray-300 rounded-md w-16"
              size={1}
              readOnly
            />
            <IconButton onClick={incrementQuantity} icon={<PlusCircleIcon size={15} />} />
          </div>
        </div>
      </li>
    </Container>
  );
};

export default CartItems;
