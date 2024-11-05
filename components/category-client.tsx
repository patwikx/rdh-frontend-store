'use client'

import React, { useMemo, useState } from 'react'
import { Product, Size, Color, Category } from "@/types"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Grid, List, Search } from "lucide-react"
import NoResults from "@/components/ui/no-results"
import ProductCard from "@/components/ui/product-card"
import MobileFilters from '@/app/(routes)/category/[categoryId]/components/mobile-filters'
import Filter from '@/app/(routes)/category/[categoryId]/components/filter'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CategoryClientProps {
  products: Product[]
  sizes: Size[]
  colors: Color[]
  category: Category
}

export default function CategoryClient({ products, sizes, colors, category }: CategoryClientProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState("manual")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        result.sort((a, b) => b.price - a.price)
        break
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
    }

    return result
  }, [products, searchQuery, sortOption])

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage)
  const currentProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          {category.name}
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Explore our extensive collection of {category.name.toLowerCase()}, featuring elegant items, beautifully crafted pieces, 
          and a variety of accessories. Perfect for any occasion, adding charm to every celebration. Get your items online and transform 
          your space with high-quality, stylish pieces. Shop quickly, securely, and safely from the comfort of your home.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredAndSortedProducts.length)} of {filteredAndSortedProducts.length} products
        </p>
        <div className="flex items-center gap-2">
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="name-asc">Name: A to Z</SelectItem>
              <SelectItem value="name-desc">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>
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

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search for products in this collection"
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
          {currentProducts.length === 0 && <NoResults />}
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {currentProducts.map((item) => (
              <ProductCard key={item.id} data={item} viewMode={viewMode} />
            ))}
          </div>
          {filteredAndSortedProducts.length > 0 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}