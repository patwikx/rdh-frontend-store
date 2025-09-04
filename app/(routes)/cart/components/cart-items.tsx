"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { HelpCircle, Minus, Plus, Trash2 } from "lucide-react";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CartItemsProps {
  data: Product;
}

const CartItems: React.FC<CartItemsProps> = ({ data }) => {
  const cart = useCart();
  const item = cart.items.find((item) => item.id === data.id);
  const [quantity, setQuantity] = useState(item?.quantity || 0);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    if (item) {
      setQuantity(item.quantity);
    }
  }, [item]);

  const onRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      cart.removeItem(data.id);
      setIsRemoving(false);
    }, 300);
  };

  const incrementQuantity = () => {
    cart.incrementQuantity(data.id);
  };

  const decrementQuantity = () => {
    cart.decrementQuantity(data.id);
  };

  return (
    <AnimatePresence>
      {!isRemoving && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
        >
          <div className="relative h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden rounded-md">
  {data.images && data.images.length > 0 ? (
    <Image
      fill
      src={data.images[0].url}
      alt={data.name}
      className="object-cover object-center"
      sizes="(max-width: 640px) 24vw, 32vw"
      priority
    />
  ) : (
    // Fallback with Lucide React HelpCircle icon
    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
      <HelpCircle className="h-10 w-10" aria-label="No image available" />
      {/* Or if you imported Question: <Question className="h-10 w-10" /> */}
      {/* Or if you imported CircleHelp: <CircleHelp className="h-10 w-10" /> */}
    </div>
  )}
          </div>
          <div className="flex-grow space-y-2 w-full sm:w-auto">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{data.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{data.color.name}</p>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors duration-200">
                          <Trash2 size={20} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove item from cart?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will remove {data.name} from your shopping cart.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={onRemove} className="bg-red-500 text-white hover:bg-red-600">
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove item</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-gray-100 text-gray-800">{data.size.name}</Badge>
              <span className="text-sm text-gray-500">{data.itemDesc}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <Currency value={data.price} />
              <div className="flex items-center space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                        className="h-8 w-8 rounded-full"
                      >
                        <Minus size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Decrease quantity</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={incrementQuantity}
                        className="h-8 w-8 rounded-full"
                      >
                        <Plus size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Increase quantity</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Subtotal: <Currency value={data.price * quantity} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartItems;