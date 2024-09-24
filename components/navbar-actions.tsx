"use client"

import useCart from "@/hooks/use-cart";
import { LogIn, LogInIcon, ShoppingBag, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Product } from "@/types";
import HoverItems from "./hover";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Avatar, AvatarImage } from "@/components/ui/avatar"; // Adjust the import based on your structure
import Headerx from "./header";
import Currency from "./ui/currency";

interface HoverItemsProps {
    data?: Product;
}

export const revalidate = 0;

const NavbarActions: React.FC<HoverItemsProps> = ({ data }) => {
    const router = useRouter();
    const cart = useCart();
    const items = useCart((state) => state.items);
    const [isMounted, setIsMounted] = useState(false);
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

    return (
        <div className="ml-auto flex items-center gap-x-4">
            <HoverCard>
                <HoverCardTrigger asChild>
                    <Button onClick={() => router.push("/cart")} className="flex items-center rounded-full px-4 py-2">
                        <ShoppingBag size={20} />
                        <span className="ml-2 text-sm font-medium">{cart.items.length}</span>
                    </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                    <div className="flex items-center space-x-2">
                        <Label className="text-lg font-bold">Shopping Cart</Label>
                        <ShoppingCart size={20} />
                    </div>
                    <Separator className="mt-2" />
                    <div className="flex justify-between space-x-4 mt-2">
                        <div className="lg:col-span-7">
                            {cart.items.length === 0 && (
                                <p className="text-neutral-500">No items added to cart.</p>
                            )}
                            <ul>
                                {cart.items.map((item) => (
                                    <HoverItems key={item.id} data={item} />
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="flex mt-4 justify-between">
                        <div>
                            <Label className="font-bold text-lg">Total</Label>
                        </div>
                        <div className="text-right mr-4 mt-2 font-bold">
                            <Label className="font-bold text-lg"><Currency value={totalPrice} /></Label>
                        </div>
                    </div>
                    <Separator className="mt-2" />
                    <Button onClick={() => router.push("/cart")} className="w-full mt-6">Checkout</Button>
                </HoverCardContent>
            </HoverCard>
            {session ? (
<Headerx />
            ) : (
                <Button onClick={() => router.push("/auth/sign-in")}><LogIn size={20} className="mr-2" />Login</Button>
            )}
        </div>
    )
}

export default NavbarActions;
