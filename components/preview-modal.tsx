'use client'

import { useState } from 'react'
import Image from 'next/image'
import usePreviewModal from '@/hooks/use-preview-modal'
import Modal from './ui/modal'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { 
  MinusIcon, 
  PlusIcon, 
  ShoppingCart, 
  Star,
  Check,
  Package,
  RefreshCcw,
  Shield
} from 'lucide-react'
import Currency from './ui/currency'
import Gallery from './gallery/intex'

export default function PreviewModal() {
  const previewModal = usePreviewModal()
  const product = usePreviewModal((state) => state.data)
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return null
  }

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  const inStock = true
  const rating = 4.5

  return (
    <Modal
      open={previewModal.isOpen}
      onClose={previewModal.onClose}
    >
      <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
        <div className="sm:col-span-4 lg:col-span-5">
          <Gallery images={product.images} />
          
          <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
            <div className="flex flex-col items-center text-center">
              <Package className="h-5 w-5 mb-2" />
              <p>Free Shipping</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <RefreshCcw className="h-5 w-5 mb-2" />
              <p>30-Day Returns</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Shield className="h-5 w-5 mb-2" />
              <p>Secure Payment</p>
            </div>
          </div>
        </div>

        <div className="sm:col-span-8 lg:col-span-7">
          <div className="mb-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                <div className="flex items-center gap-2 mr-8">
                  <div className="flex items-center bg-primary/5 px-2 py-1 rounded-md">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium">{rating}</span>
                  </div>
                </div>
              </div>

              <Badge variant="outline" className="w-fit">
                <p className="text-sm text-muted-foreground">{product.category?.name}</p>
              </Badge>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Item Description</h3>
                <p className="text-sm text-muted-foreground">
                  {product.itemDesc || "Construction Supplies Bundle 1 Construction Supplies Bundle 1 Construction Supplies Bundle 1"}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">
                  <Currency value={product.price} />
                </span>
                {inStock ? (
                  <Badge variant="secondary" className="font-medium">
                    <Check className="mr-1 h-3 w-3" /> In Stock
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Quantity</h3>
            <div className="flex w-full items-center rounded-md border shadow-sm">
              <Button
                onClick={decrementQuantity}
                variant="ghost"
                className="h-10 w-14 rounded-l-md border-r hover:bg-muted"
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
              <div className="flex-1 text-center border-r">
                <span className="text-lg font-medium">{quantity}</span>
              </div>
              <Button
                onClick={incrementQuantity}
                variant="ghost"
                className="h-10 w-14 rounded-r-md hover:bg-muted"
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <Button className="w-full" size="lg">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}