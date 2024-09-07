import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import toast from "react-hot-toast";
import { Product } from "@/types";

interface CartItem extends Product {
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (data: Product) => void;
    removeItem: (id: string) => void;
    incrementQuantity: (id: string) => void;
    decrementQuantity: (id: string) => void;
    removeAll: () => void;
}

const useCart = create(
    persist<CartStore>((set, get) => ({
        items: [],
        addItem: (data: Product) => {
            const currentItems = get().items;
            const existingItem = currentItems.find((item) => item.id === data.id);

            if (existingItem) {
                // Update quantity if the item already exists
                set({
                    items: currentItems.map((item) =>
                        item.id === data.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                });
                toast.success("Item quantity updated.");
            } else {
                // Add new item with quantity 1
                set({ items: [...currentItems, { ...data, quantity: 1 }] });
                toast.success("Item added to cart.");
            }
        },
        removeItem: (id: string) => {
            set({ items: get().items.filter((item) => item.id !== id) });
            toast.success("Item removed from the cart.");
        },
        incrementQuantity: (id: string) => {
            set({
                items: get().items.map((item) =>
                    item.id === id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ),
            });
        },
        decrementQuantity: (id: string) => {
            set({
                items: get().items.map((item) =>
                    item.id === id && item.quantity > 1
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                ),
            });
            toast.success("Item quantity updated.");
        },
        removeAll: () => set({ items: [] }),
    }), {
        name: "cart-storage",
        storage: createJSONStorage(() => localStorage),
    })
);

export default useCart;