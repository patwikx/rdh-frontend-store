import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/types";
import { toast } from "sonner";

interface CartItem extends Product {
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    temporaryQuantity: number;
    setTemporaryQuantity: (quantity: number) => void;
    resetTemporaryQuantity: () => void;
    addItem: (data: Product) => void;
    removeItem: (id: string) => void;
    incrementQuantity: (id: string) => void;
    decrementQuantity: (id: string) => void;
    removeAll: () => void;
}

const useCart = create(
    persist<CartStore>((set, get) => ({
        items: [],
        temporaryQuantity: 1,
        setTemporaryQuantity: (quantity: number) => set({ temporaryQuantity: quantity }),
        resetTemporaryQuantity: () => set({ temporaryQuantity: 1 }),
        addItem: (data: Product) => {
            const currentItems = get().items;
            const { temporaryQuantity } = get();
            const existingItem = currentItems.find((item) => item.id === data.id);

            if (existingItem) {
                set({
                    items: currentItems.map((item) =>
                        item.id === data.id
                            ? { ...item, quantity: item.quantity + temporaryQuantity }
                            : item
                    ),
                });
                toast.success("Item quantity updated.");
            } else {
                set({ items: [...currentItems, { ...data, quantity: temporaryQuantity }] });
                toast.success("Item added to cart.");
            }
            set({ temporaryQuantity: 1 }); // Reset temporary quantity after adding the item
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
        },
        removeAll: () => set({ items: [] }),
    }), {
        name: "cart-storage",
        storage: createJSONStorage(() => localStorage),
    })
);

export default useCart;