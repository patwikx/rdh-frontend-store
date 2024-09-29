"use client";

import Container from "@/components/ui/container";
import useCart from "@/hooks/use-cart";
import CartItems from "./components/cart-items";
import Summary from "./components/summary";
import { ScrollArea } from "@/components/ui/scroll-area"; // Import the ScrollArea component
import React from "react";

const CartPage = () => {
  const cart = useCart();

  return (
    <div>
      <Container>
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold sm:text-3xl">
            My Cart ({cart.items.length})
          </h1>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 lg:items-start gap-x-12">
            <div className="lg:col-span-7">
              {cart.items.length === 0 && (
                <p className="text-neutral-500">No items added to cart.</p>
              )}
              <ScrollArea className="h-[30rem] sm:h-[44rem] rounded-md border">
                <div className="p-2 sm:p-4 flex flex-col items-center"> {/* Center items for mobile */}
                  <ul className="space-y-2 sm:space-y-4 w-full"> {/* Full width with space between items */}
                    {cart.items.map((item) => (
                      <React.Fragment key={item.id}>
                        <CartItems data={item} />
                      </React.Fragment>
                    ))}
                  </ul>
                </div>
              </ScrollArea>
            </div>
            <div className="lg:col-span-5 mt-6 lg:mt-0">
              <Summary />
            </div>
          </div>
        </div>

        <div>
          {/* Any additional content can go here */}
        </div>
      </Container>
    </div>
  );
};

export default CartPage;
