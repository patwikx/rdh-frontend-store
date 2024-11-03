"use client";

import useCart from "@/hooks/use-cart";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import CartItems from "./cart-items";
import Summary from "./summary";

const CheckoutPage = () => {
  const cart = useCart();
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <Button onClick={() => router.push("/")} variant="outline" className="flex items-center text-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
        </div>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg mb-8">
              <div className="px-4 py-6 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Order Summary ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})
                </h2>
              </div>
              {cart.items.length === 0 ? (
                <div className="px-4 py-6 sm:px-6 text-center">
                  <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
                  <p className="mt-1 text-sm text-gray-500">Add some items to your cart to checkout.</p>
                </div>
              ) : (
                <ScrollArea className="h-[30rem] sm:h-[40rem]">
                  <ul className="divide-y divide-gray-200">
                    {cart.items.map((item) => (
                      <li key={item.id} className="px-4 py-6 sm:px-6">
                        <CartItems data={item} />
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg sticky top-8">
              <Summary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;