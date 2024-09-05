"use client"

import { Product } from "@/types"
import Currency from "./ui/currency"
import Buttons from "./ui/Button"
import { ShoppingCart } from "lucide-react"
import useCart from "@/hooks/use-cart"
import { MouseEventHandler } from "react"
import { useRouter } from "next/navigation"

interface InfoProps {
    data: Product
}


const Info: React.FC<InfoProps> = ({
    data
}) => {

    const cart = useCart();
const router = useRouter();
const handleClick = () => {
router.push(`/product/${data?.id}`);
}
const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();

    cart.addItem(data);
}
  return (
    <div>
        <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
        <div className="mt-3 items-end justify-between">
            <p className="text-2xl text-gray-900">
            <Currency value={data.price} />
            </p>
        </div>
        <hr className="my-4" />
        <div>

     
        <div className="flex items-center gap-x-4">
        <h3 className="font-semibold text-black">
        Size:
        </h3>
        <div>
            {data?.size?.name}
        </div>
        </div>
        <div className="flex items-center gap-x-4">
        <h3 className="font-semibold text-black">
        Color:
        </h3>
        <div className="h-6 w-6 rounded-full border border-gray-600" style={{backgroundColor: data?.color?.value}} />
        </div>
        </div>
        <div className="mt-10 felx items-center gap-x-3">
        <Buttons onClick={onAddToCart} className="flex items-center gap-x-2">
        Add to Cart
        <ShoppingCart />
        </Buttons>
        </div>
        </div>
  )
}

export default Info