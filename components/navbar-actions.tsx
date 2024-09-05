"use client"

import Buttons from "@/components/ui/Button"
import useCart from "@/hooks/use-cart";
import { ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const revalidate = 0;

const NavbarActions = () => {

const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
    setIsMounted(true);
}, []);

const router = useRouter();
const cart = useCart();

if (!isMounted) {
    return null;
}

    return (
        <div className="ml-auto flex items-center gap-x-4">
            <Buttons onClick={() => router.push("/cart")} className="flex items-center rounded-full bg-black px-4 py-2">
                <ShoppingBag size={20}
                color="white" />
                <span className="ml-2 text-sm font-medium text-white">
                    {cart.items.length}
                </span>
            </Buttons>
        </div>
    )
}

export default NavbarActions