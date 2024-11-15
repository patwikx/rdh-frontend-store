'use client'

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Product } from "@/types"
import { ChevronLeft, ChevronRight } from "lucide-react"

import NoResults from "@/components/ui/no-results"
import ProductCard from "@/components/ui/product-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const revalidate = 0;

interface ProductCarouselProps {
  title: string
  items: Product[]
  categoryId: string
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ title, items, categoryId }) => {
  const [sortBy, setSortBy] = useState("featured")
  const carouselRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === "priceLowToHigh") return Number(a.price) - Number(b.price)
    if (sortBy === "priceHighToLow") return Number(b.price) - Number(a.price)
    if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    return 0 // Default (featured) sorting
  })

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { current } = carouselRef
      const scrollAmount = direction === 'left' ? -current.offsetWidth : current.offsetWidth
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const handleViewAll = () => {
    router.push(`/category/${categoryId}`)
  }

  return (
    <div className="w-full">
      <CardHeader className="flex flex-row justify-between items-center">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <CardTitle className="text-2xl font-bold tracking-tight text-primary">{title}</CardTitle>
          <Button
            variant="outline"
            onClick={handleViewAll}
            className="self-start sm:self-auto group transition-colors hover:text-primary-foreground hover:bg-primary"
          >
            View All
            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
        <span className="mr-1 font-semibold">Sort by:</span>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="priceLowToHigh">Price: Low to High</SelectItem>
            <SelectItem value="priceHighToLow">Price: High to Low</SelectItem>
            <SelectItem value="newest">Newest Arrivals</SelectItem>
          </SelectContent>
        </Select>
        </div>

      </CardHeader>
      <CardContent className="relative px-12">
        {items.length === 0 ? (
          <NoResults />
        ) : (
          <>
            <div 
              ref={carouselRef} 
              className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide items-center min-h-[400px]"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {sortedItems.map((item) => (
                <div key={item.id} className="flex-none w-64 h-full" style={{ scrollSnapAlign: 'start' }}>
                  <ProductCard data={item} viewMode="grid" />
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="absolute -left-6 top-1/2 transform -translate-y-1/2"
              onClick={() => scroll('left')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute -right-6 top-1/2 transform -translate-y-1/2"
              onClick={() => scroll('right')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </CardContent>
    </div>
  )
}

export default ProductCarousel