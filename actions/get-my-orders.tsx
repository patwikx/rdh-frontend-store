import { OrderItem } from "@/types";
import { getSession } from "next-auth/react";
import qs from "query-string";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/orders`;

const getMyOrders = async (): Promise<OrderItem[]> => {
  // Get session from NextAuth
  const session = await getSession();

  // If no session or no user, return an empty array or handle it accordingly
  if (!session || !session.user) {
    return [];
  }

  // Get user ID from the session
  const userEmail = session.user.email;  // Assuming the session includes a user ID

  // Construct the URL with the user ID as a query parameter
  const url = qs.stringifyUrl({
    url: URL,
    query: {
        userEmail,  // User ID to filter the orders
    },
  });

  const res = await fetch(url);

  return res.json();
};

export default getMyOrders;
