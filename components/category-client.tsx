'use client'

import React, { useState } from 'react'
import { Product, Size, Color, Category } from "@/types"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, Grid, List } from "lucide-react"
import NoResults from "@/components/ui/no-results"
import ProductCard from "@/components/ui/product-card"
import MobileFilters from '@/app/(routes)/category/[categoryId]/components/mobile-filters'
import Filter from '@/app/(routes)/category/[categoryId]/components/filter'


interface CategoryClientProps {
  products: Product[]
  sizes: Size[]
  colors: Color[]
  category: Category
}

export default function CategoryClient({ products, sizes, colors, category }: CategoryClientProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {category.name}
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Sort by <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="hidden md:flex"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="hidden md:flex"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
        <MobileFilters sizes={sizes} colors={colors} />
        <div className="hidden lg:block space-y-4">
          <div className="rounded-lg border bg-white p-4">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            <Filter valueKey="sizeId" name="Sizes" data={sizes} />
            <Separator className="my-4" />
            <Filter valueKey="colorId" name="Colors" data={colors} />
          </div>
        </div>
        <div className="mt-6 lg:col-span-4 lg:mt-0">
          {products.length === 0 && <NoResults />}
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {products.map((item) => (
              <ProductCard key={item.id} data={item} viewMode={viewMode} />
            ))}
          </div>
          {products.length > 0 && (
            <div className="flex justify-center mt-8">
              <Button>Load More</Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}