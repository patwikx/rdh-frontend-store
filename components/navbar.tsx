import Link from "next/link"
import Image from "next/image"
import { Menu, Search, ShoppingCart } from "lucide-react"
import NavbarActions from "@/components/navbar-actions"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
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
      <div className="flex h-16 items-center gap-x-4 px-4 sm:px-6">
        {/* Menu Button (Mobile) */}
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
          >
            <Menu className="h-5 w-5 mr-2" />
            Menu
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {categories.map((category) => (
            <DropdownMenuItem key={category.id} asChild>
              <Link 
                href={`/category/${category.id}`}
                className="flex w-full items-center"
              >
                {category.name}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-x-2 shrink-0">
          <div className="relative aspect-square w-8 sm:w-10">
            <Image
              src="/RDH.webp"
              alt="RDHFSI Store Logo"
              fill
              sizes='auto'
              className="object-contain"
              priority
            />
          </div>
          <div className="hidden sm:flex flex-col items-start leading-none">
            <span className="text-base font-bold">RD Hardware</span>
            <span className="text-xs text-muted-foreground">& Fishing Supply, Inc.</span>
          </div>
          <span className="font-semibold text-lg sm:hidden">RDHFSI</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 flex items-center justify-center max-w-3xl mx-auto px-4 lg:px-8">
          <SearchBar products={products} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-x-4 shrink-0">
          <NavbarActions />
        </div>
      </div>

      {/* Mobile Search (Shown below navbar on small screens) */}
      <div className="border-t sm:hidden p-3">
        <SearchBar products={products} />
      </div>
    </div>
  )
}

export default Navbar