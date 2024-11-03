"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Eye, Heart, ShoppingCart, Star } from "lucide-react"

import { Product } from "@/types"
import usePreviewModal from "@/hooks/use-preview-modal"
import useCart from "@/hooks/use-cart"
import useWishlist from "@/hooks/use-wishlist"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Currency from "@/components/ui/currency"

interface ProductCardProps {
  data: Product
  viewMode: "grid" | "list"
}

const ProductCard: React.FC<ProductCardProps> = ({ data, viewMode }) => {
  const router = useRouter()
  const previewModal = usePreviewModal()
  const cart = useCart()
  const wishlist = useWishlist()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => {
    router.push(`/product/${data?.id}`)
  }

  const onPreview = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    previewModal.onOpen(data)
  }

  const onAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setIsLoading(true)
    cart.addItem(data)
    setTimeout(() => setIsLoading(false), 500)
  }

  const onAddToWishlist = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    wishlist.addItem(data)
  }

  const discountPercentage = 20

  return (
    <Card 
      onClick={handleClick}
      className={`group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg ${
        viewMode === "list" ? "flex" : "max-w-[240px]"
      }`}
    >
      <CardContent className={`p-2 ${viewMode === "list" ? "w-1/3" : ""}`}>
        <div className="relative aspect-square overflow-hidden rounded-md">
          <Image
            src={data?.images?.[0]?.url}
            alt={data.name}
            fill
            sizes='auto'
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            priority
          />
          {discountPercentage > 0 && (
            <Badge className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1.5 py-0.5">
              -{discountPercentage}%
            </Badge>
          )}
          <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button size="icon" variant="secondary" onClick={onPreview} className="h-7 w-7">
              <Eye className="h-3 w-3" />
            </Button>
            <Button size="icon" variant="secondary" onClick={onAddToWishlist} className="h-7 w-7">
              <Heart className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className={`flex flex-col items-start gap-1 p-2 ${viewMode === "list" ? "w-2/3" : ""}`}>
        <div className="flex w-full items-center justify-between gap-2">
          <h3 className="font-medium text-sm line-clamp-1">{data.name}</h3>
          <div className="flex items-center shrink-0">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="ml-0.5 text-xs font-medium">4.5</span>
          </div>
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold"><Currency value={data.price} /></span>
            {discountPercentage > 0 && (
              <span className="text-xs text-muted-foreground line-through">
                <Currency value={data.price / (1 - discountPercentage / 100)} />
              </span>
            )}
          </div>
        </div>
        <Badge variant="outline" className="text-xs px-2 py-0.5">{data.category.name}</Badge>
        <Button 
          onClick={onAddToCart} 
          disabled={isLoading || data.stock === 0} 
          className="w-full h-8 text-xs mt-1"
          size="sm"
        >
          <ShoppingCart className="h-3 w-3 mr-1.5" />
          {data.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ProductCard