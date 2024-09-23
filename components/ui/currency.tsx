"use client"

import { useEffect, useState } from "react";

export const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  });

  interface CurrencyProps {
    value?: string | number;
  }

const Currency: React.FC<CurrencyProps> = ({
    value
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    if (!isMounted) {
        return null;
    }
  return (
    <div className="text-xs font-semibold">
        {formatter.format(Number(value))}
    </div>
  )
}

export default Currency