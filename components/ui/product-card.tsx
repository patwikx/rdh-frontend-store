"use client"

import { Product } from "@/types"
import Image from "next/image";
import IconButton from "./icon-button";
import { Expand, ShoppingCart } from "lucide-react";
import Currency from "./currency";
import { useRouter } from "next/navigation";
import { MouseEventHandler } from "react";
import usePreviewModal from "@/hooks/use-preview-modal";
import useCart from "@/hooks/use-cart";
import { Badge } from "./badge";
import { Label } from "./label";

interface ProductCard {
    data: Product;
}

const ProductCard: React.FC<ProductCard> = ({
    data
}) => {

const cart = useCart();
const previewModal = usePreviewModal();
const router = useRouter();
const handleClick = () => {
router.push(`/product/${data?.id}`);
}

const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();

    previewModal.onOpen(data);
}

const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();

    cart.addItem(data);
}

  return (
    <div onClick={handleClick} className="group cursor-pointer rounded-xl border p-3 space-y-4">
        <div className="aspect-square rounded-xl bg-gray-100 relative">
        <Image
        src={data?.images?.[0]?.url}
        alt="Image"
        fill
        className="aspect-square object-cover rounded-md border border-gray-300"
        />

        <div className="opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
            
        <div className="flex gap-x-6 justify-center">
            <IconButton
            onClick={onPreview}
            icon={<Expand size={20} className="text-gray-600" />}
            />
             <IconButton
            onClick={onAddToCart}
            icon={<ShoppingCart size={20} className="text-gray-600" />}
            />
        </div>
        </div>
        </div>
        {/* Description*/}
        <div>
            <Label className="font-bold">{data.name}</Label>
            <div>
            <Badge variant='outline'>{data.category?.name}</Badge>
            </div>
            
        </div>
        {/* Price */}
        <div className="flex items-center justify-between">
            <Currency value={data.price}/>
        </div>
    </div>
  )
}

export default ProductCard