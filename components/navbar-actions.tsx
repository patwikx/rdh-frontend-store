"use client"

import useCart from "@/hooks/use-cart";
import { LogIn, ShoppingBag, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { useCurrentUser } from "@/hooks/use-current-user";
import Currency from "./ui/currency";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Headerx from "./header";
import Image from "next/image";
import { Product } from "@/types";
import { ModeToggle } from "./mode-toggle";
import { Card, CardContent } from "./ui/card";

interface HoverItemsProps {
    data?: Product;
}

export const revalidate = 0;

const NavbarActions: React.FC<HoverItemsProps> = ({ data }) => {
    const router = useRouter();
    const cart = useCart();
    const items = useCart((state) => state.items);
    const [isMounted, setIsMounted] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const session = useCurrentUser();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    const totalPrice = items.reduce((total, item) => {
        return total + Number(item.price) * item.quantity;
    }, 0);

    const handleCheckout = () => {
        setIsSheetOpen(false);
        router.push("/cart");
    };

    return (
        <div className="ml-auto flex items-center gap-x-4">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                    <Button className="flex items-center rounded-full px-4 py-2">
                        <ShoppingBag size={20} />
                        <span className="ml-2 text-sm font-medium">{cart.items.length}</span>
                    </Button>
                </SheetTrigger>
                <SheetContent className="w-80 p-4">

                 
                    <div className="flex items-center justify-center mt-8">
                        <Image src='/RDH.webp' width={100} height={100} alt="RDH Image"/>
                        <Label className="flex items-center justify-center font-bold text-xl">
                        RD Hardware & Fishing Supply, Inc.
                        </Label>
                    </div>
                    <div className="flex items-center justify-between mt-8">
                        <Label className="text-lg font-bold">Shopping Cart</Label>
                        <ShoppingBag size={20} />
                    </div>
                    <Separator className="mt-2" />
                    <Card className="mt-4">
                    <CardContent>

                    {cart.items.length === 0 ? (
                        <p className="text-neutral-500 mt-4">Your cart is empty.</p>
                    ) : (
                        <div className="flex flex-col space-y-3 mt-4">
                            {cart.items.map((item) => (
                                <div key={item.id} className="flex items-center space-x-3">
                                    <Image 
                                        src={item.images[0].url || "/placeholder-image.png"} 
                                        alt={item.name} 
                                        width={36} 
                                        height={36} 
                                        className="rounded-md object-cover"
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold">{item.name}</p>
                                        <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <Currency value={Number(item.price) * item.quantity} />
                                    </div>
                                </div>
                            ))}

                            <Separator className="my-3" />
                            <div className="flex justify-between items-center">
                                <Label className="font-bold text-lg">Total</Label>
                                <div className="text-right font-bold text-lg">
                                <Label className="text-lg font-bold">₱ 
  {totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
</Label>
                                </div>
                            </div>

                            <Button onClick={handleCheckout} className="w-full mt-4">
                                Proceed to Checkout
                            </Button>
                        </div>
                    )}
                        </CardContent>
                       </Card>
                </SheetContent>
            </Sheet>

            {session ? (
                <Headerx />
            ) : (
                <Button onClick={() => router.push("/auth/sign-in")}>
                    <LogIn size={20} className="mr-2" />
                    Login
                </Button>
            )}
        </div>
    );
};

export default NavbarActions;
