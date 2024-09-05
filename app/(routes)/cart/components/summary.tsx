"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Buttons from "@/components/ui/Button";
import Currency from "@/components/ui/currency";
import { toast } from "react-hot-toast";

import useCart from "@/hooks/use-cart";
import { Loader } from "@/components/ui/loader";

const Summary = () => {
    const searchParams = useSearchParams();
    const items = useCart((state) => state.items);
    const removeAll = useCart((state) => state.removeAll);

    // State to manage loading animation
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (searchParams.get("success")) {
            toast.success("Order completed.");
            removeAll();
        }

        if (searchParams.get("canceled")) {
            toast.error("Something went wrong.");
        }
    }, [searchParams, removeAll]);

    const totalPrice = items.reduce((total, item) => {
        return total + Number(item.price);
    }, 0);

    const onCheckout = async () => {
        if (items.length === 0) {
            toast.error("No items in the cart.");
            return;
        }

        setLoading(true); // Start loading animation

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
                productsId: items.map((item) => item.id),
            });

            if (response.status === 201) {
                toast.success("Order created successfully! Redirecting...");
                removeAll();
                setTimeout(() => {
                    window.location.href = response.data.redirectUrl || "/";
                }, 500); // Delay in milliseconds
            } else {
                toast.error("Checkout failed. Please try again.");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error("There was an error processing your order.");
        } finally {
            setLoading(false); // Stop loading animation
        }
    };

    return (
        <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
            <div className="mt-6 space-y-4">
                <ul className="list-disc ml-5">
                    {items.map((item) => (
                        <li key={item.id} className="text-sm text-gray-700">
                            <div className="flex justify-between">
                                <span>{item.name}</span>
                                <Currency value={item.price} />
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="text-base font-medium text-gray-900">Order total</div>
                    <Currency value={totalPrice} />
                </div>
            </div>
            {loading ? (
                <div className="flex items-center justify-center mt-6">
                    <Loader />
                </div>
            ) : (
                <Buttons onClick={onCheckout} className="w-full mt-6">
                    Checkout
                </Buttons>
            )}
        </div>
    );
};

export default Summary;
