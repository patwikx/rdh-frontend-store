"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { Loader } from "@/components/ui/loader";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { HandCoins, Truck } from "lucide-react";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-current-user";


const Summary = () => {
    const searchParams = useSearchParams();
    const items = useCart((state) => state.items);
    const removeAll = useCart((state) => state.removeAll);
    const session = useCurrentUser();

    const [loading, setLoading] = useState(false);

    // Delivery information states
    const [companyName, setCompanyName] = useState("");
    const [poNumber, setPoNumber] = useState("");
    const [address, setAddress] = useState("");
    const [contactNumber, setContactNumber] = useState("");

    // Radio button state to toggle delivery information visibility
    const [deliveryMethod, setDeliveryMethod] = useState("pick-up"); // Default is 'pick-up'

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
        return total + Number(item.price) * item.quantity;
    }, 0);

    const onCheckout = async () => {
        // Check if the user is logged in
        if (!session) {
            toast.error("You must log in first before proceeding.");
            return; // Stop further execution
        }
    
        // Check if there are items in the cart
        if (items.length === 0) {
            toast.error("No items in the cart.");
            return;
        }
    
        // Check delivery information if delivery method is selected
        if (deliveryMethod === "delivery" && (!companyName || !poNumber || !address || !contactNumber)) {
            toast.error("Please fill in all the delivery information fields.");
            return;
        }
    
        // Check for missing quantities
        const missingQuantities = items.some(item => !item.quantity || item.quantity <= 0);
        if (missingQuantities) {
            toast.error("Quantities must be provided for all product IDs.");
            return;
        }
    
        setLoading(true); // Start loading animation
    
        try {
            const orderItems = items.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
                totalItemAmount: Number(item.price) * item.quantity
            }));
    
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
                orderItems,
                companyName: deliveryMethod === "delivery" ? companyName : "",
                poNumber: deliveryMethod === "delivery" ? poNumber : "",
                address: deliveryMethod === "delivery" ? address : "",
                contactNumber: deliveryMethod === "delivery" ? contactNumber : "",
            });
    
            if (response.status === 201) {
                toast.success("Order created successfully! Redirecting...");
                removeAll();
                setTimeout(() => {
                    window.location.href = response.data.redirectUrl || "/";
                }, 500);
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
        <div className="mt-16 rounded-lg border border-gray-200 bg-white shadow-sm px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
    <h2 className="text-lg font-bold">Order Summary</h2>
    <div className="mt-6 space-y-4">
        <ul className="list-disc ml-5">
            {items.map((item) => (
                <li key={item.id} className="text-sm">
                    <div className="flex flex-row">
                        <span>{item.name}</span>
                        <span className="ml-4"> ({item.quantity})</span>
                        <div className="flex flex-row ml-auto items-end">
                            <Currency value={Number(item.price) * item.quantity} />
                        </div>
                    </div>
                </li>
            ))}
        </ul>
        <div className="flex items-center justify-between border-t pt-4">
            <div className="text-base font-bold">Total</div>
            <Currency value={totalPrice} />
        </div>
    </div>
    <div className="mt-4">
        <Separator />
    </div>
    <div className="mt-6">
        <RadioGroup value={deliveryMethod} onValueChange={(value) => setDeliveryMethod(value)}>
            <div className="flex items-center justify-center space-x-2">
                <RadioGroupItem value="pick-up" id="r2" />
                <Label htmlFor="r2" className="font-bold">Pick-up</Label>
                <HandCoins size={20} />
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delivery" id="r3" className="ml-16 border-b" />
                    <Label htmlFor="r3" className="font-bold">Delivery</Label>
                    <Truck className="ml-2" size={20} />
                </div>
            </div>
        </RadioGroup>
    </div>

    {/* Conditionally render delivery information based on selected method */}
    {deliveryMethod === "delivery" && (
        <>
            <div className="mt-6">
                <label className="mt-6 font-bold text-xl">
                    Delivery Information
                </label>
            </div>
            <div className="mt-2 space-y-4">
                <label className="block">
                    <span className="font-semibold text-md">Company Name</span>
                    <Input
                        type="name"
                        placeholder="Company Name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </label>
                <label className="block">
                    <span className="font-semibold text-md">PO #</span>
                    <Input
                        type="text"
                        placeholder="PO #"
                        value={poNumber}
                        onChange={(e) => setPoNumber(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </label>
                <label className="block">
                    <span className="font-semibold text-md">Address</span>
                    <Input
                        type="address"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </label>
                <label className="block">
                    <span className="font-semibold text-md">Contact Number</span>
                    <Input
                        type="text"
                        placeholder="Contact Number"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </label>
            </div>
        </>
    )}

    {loading ? (
        <div className="flex items-center justify-center mt-6">
            <Loader />
        </div>
    ) : (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="w-full mt-6">Checkout</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onCheckout}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )}
</div>
    );
};

export default Summary;