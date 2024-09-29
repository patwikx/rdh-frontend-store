import { Order } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/order-details`;

const getOrderDetails = async (orderId: string): Promise<Order> => {
    const res = await fetch(`${URL}?orderId=${encodeURIComponent(orderId)}`);

    if (!res.ok) {
        throw new Error('Failed to fetch order details');
    }

    return res.json();
};

export default getOrderDetails;
