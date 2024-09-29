'use client'


import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; // Assuming you're using NextAuth for authentication
import getMyOrders from '@/actions/get-my-orders';
import { Order } from '@/types'; // Adjust the import based on your file structure

const MyOrderPage = () => {
  const { data: session } = useSession(); // Get the user session
  const [orders, setOrders] = useState<Order[]>([]); // State to hold the orders
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchOrders = async () => {
      if (session?.user?.email) {
        try {
          const fetchedOrders = await getMyOrders(session.user.email);
          setOrders(fetchedOrders); // Set the orders in state
        } catch (err) {
          const errorMessage = (err as Error).message; // Cast to Error for better typing
          setError(errorMessage); // Set the error message
        } finally {
          setLoading(false); // Set loading to false
        }
      }
    };

    fetchOrders();
  }, [session]);


  return (
    <div>
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p> // Message when no orders are found
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order.id}>
              <h2>Order ID: {order.id}</h2>
              <p>Ordered on: {new Date(order.createdAt).toLocaleDateString()}</p>
              <h3>Order Items:</h3>
              <ul>
                {order.orderItems.map(item => (
                  <li key={item.product.id}>
                    {item.product.name} - Quantity: {item.quantity} - Price: ₱{(item.product.price)}
                  </li>
                ))}
              </ul>
              <p>Total: ₱{order.orderItems.length}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyOrderPage;
