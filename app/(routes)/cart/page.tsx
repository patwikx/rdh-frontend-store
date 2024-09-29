"use client";

import Container from "@/components/ui/container";
import useCart from "@/hooks/use-cart";
import CartItems from "./components/cart-items";
import Summary from "./components/summary";
import { ScrollArea } from "@/components/ui/scroll-area"; // Import the ScrollArea component
import { Separator } from "@/components/ui/separator"; // Import the Separator component
import React from "react";

const CartPage = () => {
  const cart = useCart();

  return (
    <div>
      <Container>
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">
            My Cart ({cart.items.length})
          </h1>
          <div className="mt-4 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
            <div className="lg:col-span-7">
              {cart.items.length === 0 && (
                <p className="text-neutral-500">No items added to cart.</p>
              )}
              <ScrollArea className="h-[44rem] rounded-md border"> {/* Adjust height to fit 5 items */}
                <div className="p-4"> {/* Padding inside the scroll area */}
                  <ul className="space-y-4"> {/* Add space between items */}
                    {cart.items.map((item) => (
                      <React.Fragment key={item.id}>
                        <CartItems data={item} />
                        <Separator className="my-2" /> {/* Add separator between items */}
                      </React.Fragment>
                    ))}
                  </ul>
                </div>
              </ScrollArea>
            </div>
            <Summary />
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
