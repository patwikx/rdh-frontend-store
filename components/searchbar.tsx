'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, ImageIcon } from 'lucide-react' // 1. Icon imported
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types'

interface SearchBarProps {
  products: Product[]
}

export function SearchBar({ products }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)

  const debouncedSearch = useCallback(
    (term: string) => {
      const results = products.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      )
      setSearchResults(results) // Limit to 10 results for better UX
    },
    [products]
  )

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm) {
        debouncedSearch(searchTerm)
        setIsDropdownVisible(true)
      } else {
        setSearchResults([])
        setIsDropdownVisible(false)
      }
    }, 300)

    return () => clearTimeout(handler)
  }, [searchTerm, debouncedSearch])

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search items..."
          className="pl-8 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsDropdownVisible(true)}
          onBlur={() => setTimeout(() => setIsDropdownVisible(false), 200)}
        />
      </div>
      {isDropdownVisible && searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-[400px] overflow-y-auto">
          {searchResults.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="flex items-center p-4 hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            >
              {/* --- 2. This is the updated block --- */}
              <div className="flex-shrink-0 mr-4">
                {product.images?.[0]?.url ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />
                ) : (
                  <div className="w-[60px] h-[60px] flex items-center justify-center bg-muted rounded-md">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              {/* --- End of updated block --- */}
              
              <div className="flex-grow">
                <h3 className="font-semibold text-sm">{product.name}</h3>
                <p className="text-sm font-medium">{product.price.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">{product.category.name}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}