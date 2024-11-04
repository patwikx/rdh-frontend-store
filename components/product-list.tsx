"use client"

import { useState } from "react"
import { Product } from "@/types"
import { ChevronLeft, ChevronRight, Grid, List } from "lucide-react"

import NoResults from "@/components/ui/no-results"
import ProductCard from "@/components/ui/product-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Toggle } from "@/components/ui/toggle"

export const revalidate = 0;

interface ProductListProps {
  title: string
  items: Product[]
}

const ProductList: React.FC<ProductListProps> = ({ title, items }) => {
  const [sortBy, setSortBy] = useState("featured")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === "priceLowToHigh") return Number(a.price) - Number(b.price)
    if (sortBy === "priceHighToLow") return Number(b.price) - Number(a.price)
    if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    return 0 // Default (featured) sorting
  })

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage)
  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-center">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
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
          <Toggle
            aria-label="Toggle view"
            pressed={viewMode === "list"}
            onPressedChange={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
          </Toggle>
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <NoResults />
        ) : (
          <>
            <div className={`grid gap-4 ${
              viewMode === "grid" 
                ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6" 
                : "grid-cols-1"
            }`}>
              {paginatedItems.map((item) => (
                <ProductCard key={item.id} data={item} viewMode={viewMode} />
              ))}
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center mt-8 space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Items per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default ProductList
