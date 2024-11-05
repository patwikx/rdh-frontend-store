"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogIn, ShoppingBag, Trash2, Plus, Minus, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import useCart from "@/hooks/use-cart";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Product } from "@/types";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Currency from "@/components/ui/currency";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Headerx from "@/components/header";

interface NavbarActionsProps {
  data?: Product;
}

export const revalidate = 0;

const NavbarActions: React.FC<NavbarActionsProps> = ({ data }) => {
  const router = useRouter();
  const cart = useCart();
  const items = useCart((state) => state.items);
  const [isMounted, setIsMounted] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const session = useCurrentUser();
  const sheetTriggerRef = useRef<HTMLButtonElement>(null);
  const firstFocusableElementRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isSheetOpen && firstFocusableElementRef.current) {
      firstFocusableElementRef.current.focus();
    }
  }, [isSheetOpen]);

  if (!isMounted) return null;

  const totalPrice = items.reduce((total, item) => total + Number(item.price) * item.quantity, 0);

  const handleCheckout = () => {
    setIsSheetOpen(false);
    router.push("/cart");
  };

  const handleRemoveItem = (itemId: string) => {
    cart.removeItem(itemId);
  };

  const handleUpdateQuantity = (itemId: string, action: 'increase' | 'decrease') => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      if (action === 'increase') cart.addItem(item);
      else if (action === 'decrease' && item.quantity > 1) cart.removeItem(itemId);
    }
  };

  const handleSheetOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open && sheetTriggerRef.current) {
      sheetTriggerRef.current.focus();
    }
  };

  const actionButtonClass = "rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-200";

  return (
    <div className="ml-auto flex items-center gap-x-4">
      <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
        <SheetTrigger asChild>
          <Button
            ref={sheetTriggerRef}
            variant="outline"
            size="icon"
            className="relative rounded-full"
            aria-label="Open shopping cart"
          >
            <ShoppingBag className="h-5 w-5" />
            <AnimatePresence>
              {cart.items.length > 0 && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -top-2 -right-2">
                  <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                    {cart.items.length}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg overflow-hidden" aria-describedby={undefined}>
          <SheetHeader>
            <SheetTitle className="flex items-center justify-center gap-2">
              <Image src='/RDH.webp' width={50} height={50} alt="RD Hardware & Fishing Supply, Inc." className="rounded-full"/>
              <span className="font-bold text-xl">RD Hardware & Fishing Supply, Inc.</span>
            </SheetTitle>
          </SheetHeader>
          <Separator className="my-4" />
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
          </div>
          <ScrollArea className="h-[calc(100vh-300px)] mt-4 pr-4">
            <AnimatePresence>
              {cart.items.length === 0 ? (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-muted-foreground text-center py-6">
                  Your cart is empty.
                </motion.p>
              ) : (
                <motion.div layout className="space-y-4">
                  {cart.items.map((item) => (
                    <motion.div key={item.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
                      <Card className="overflow-hidden">
                        <CardContent className="p-4 flex items-center space-x-4">
                          <Avatar className="h-16 w-16 rounded-md">
                            <AvatarImage src={item.images[0].url || "/placeholder-image.png"} alt={item.name} />
                            <AvatarFallback>{item.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            <Currency value={Number(item.price) * item.quantity} />
                          </div>
                          <div className="flex flex-col items-center space-y-2">
                            <Button variant="outline" size="icon" onClick={() => handleUpdateQuantity(item.id, 'increase')} aria-label={`Increase quantity of ${item.name}`} className={actionButtonClass}>
                              <Plus className="h-4 w-4" />
                            </Button>
                            <span className="text-sm font-medium">{item.quantity}</span>
                            <Button variant="outline" size="icon" onClick={() => handleUpdateQuantity(item.id, 'decrease')} aria-label={`Decrease quantity of ${item.name}`} className={actionButtonClass}>
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)} aria-label={`Remove ${item.name} from cart`} className="text-destructive hover:text-destructive-foreground hover:bg-destructive transition-colors duration-200">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>
          <Separator className="my-4" />
          <CardFooter className="flex justify-between items-center">
            <div className="text-lg font-semibold">Total</div>
            <Currency value={totalPrice} />
          </CardFooter>
          <Button ref={firstFocusableElementRef} onClick={handleCheckout} className="w-full rounded-full transition-all duration-300" disabled={cart.items.length === 0}>
            Checkout
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </SheetContent>
      </Sheet>
      {session ? (
        <Headerx />
      ) : (
        <Button variant="outline" onClick={() => router.push("/auth/sign-in")}>
          <LogIn className="h-5 w-5" />
          Login / Sign-up
        </Button>
      )}
    </div>
  );
};

export default NavbarActions;
