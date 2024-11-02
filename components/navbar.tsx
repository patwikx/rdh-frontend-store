import Link from "next/link"
import Image from "next/image"
import NavbarActions from "@/components/navbar-actions"
import { Button } from "@/components/ui/button"
import getCategories from "@/actions/get-categories"
import getProducts from "@/actions/get-products"
import { SearchBar } from "./searchbar"
import { Label } from "./ui/label"

export const revalidate = 0

const Navbar = async () => {
  const categories = await getCategories()
  const products = await getProducts({ isFeatured: true })

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4"> {/* Main Navbar Container */}
        
        {/* Logo and Brand Name (Left) */}
        <div className="flex items-center gap-x-2">
          <Link href="/" className="flex items-center gap-x-2">
            <Image
              src="/RDH.webp"
              alt="RDHFSI Store Logo"
              width={35}
              height={25}
              className="h-auto w-10 sm:w-12"
            />
            <Label className="font-bold text-xl hidden sm:inline whitespace-nowrap">
              RD Hardware & Fishing Supply, Inc.
            </Label>
            <span className="font-bold text-xl sm:hidden">RDHFSI</span>
          </Link>
        </div>

        {/* Categories and Search Bar (Center) */}
        <div className="flex-1 flex items-center justify-center gap-x-4">
          {/* Categories (hidden on mobile) */}
          <div className="hidden lg:flex items-center space-x-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="ghost"
                className="text-sm font-medium transition-colors hover:text-primary"
                asChild
              >
                <Link href={`/category/${category.id}`}>
                  {category.name}
                </Link>
              </Button>
            ))}
          </div>
          
          {/* Search Bar (hidden on small screens) */}
          <div className="hidden sm:block">
            <SearchBar products={products} />
          </div>
        </div>

        {/* Navbar Actions (Right) */}
        <div className="flex items-center gap-x-4">
          <NavbarActions />
        </div>
      </div>

      {/* Mobile Categories */}
      <div className="lg:hidden overflow-x-auto flex items-center py-4 px-4 space-x-4">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="ghost"
            className="text-sm font-medium whitespace-nowrap"
            asChild
          >
            <Link href={`/category/${category.id}`}>
              {category.name}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  )
}

export default Navbar
