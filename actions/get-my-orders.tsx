import { Order } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/orders`;

const getMyOrders = async (email: string): Promise<Order[]> => {
    const res = await fetch(`${URL}?email=${encodeURIComponent(email)}`);

    if (!res.ok) {
        throw new Error('Failed to fetch orders');
    }

    return res.json();
};

export default getMyOrders;
