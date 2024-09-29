"use client";

import { cn } from "@/lib/utils";
import { Category, Product } from "@/types"; // Ensure Product type is imported
import Link from "next/link";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Input } from "./ui/input";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card"; // Ensure you import CardDescription
import Currency from "@/components/ui/currency"; // Ensure you import Currency
import { useRouter } from "next/navigation"; // Import useRouter
import { X } from "lucide-react";

interface MainNavProps {
  data: Category[];
  products: Product[]; // Pass the products as a prop
}

const MainNav: React.FC<MainNavProps> = ({
  data,
  products, // Receive products as a prop
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const router = useRouter(); // Initialize useRouter

  const routes = data.map((route) => ({
    href: `/category/${route.id}`,
    label: route.name,
  }));

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    router.push(`?search=${encodeURIComponent(searchTerm)}`); // Use router.push for navigation
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter products based on the search term
    if (value) {
      const results = products.filter(product =>
        product.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(results);
    } else {
      setFilteredProducts([]);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredProducts([]);
  };

  const handleProductClick = (productId: string) => {
    setFilteredProducts([]);
    // Navigate to the product detail page using router.push
    router.push(`/product/${productId}`);
  };

  return (
    <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-bold transition-colors hover:bg-transparent"
          )}
        >
          {route.label}
        </Link>
      ))}
      <form onSubmit={handleSearch} className="relative w-full md:w-80">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search items..."
          className="pl-10 w-full"
          value={searchTerm}
          onChange={handleInputChange} // Use new handler
        />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        {filteredProducts.length > 0 && (
          <Card className="absolute z-10 mt-1 w-full">
            <CardContent>
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                   className="flex py-4 px-4 border-gray-300 rounded-lg mt-4 cursor-pointer hover:bg-gray-100 hover:rounded-lg mb-[-2px]"
                  onClick={() => handleProductClick(product.id)} // Handle click to navigate
                >
                  <div className="relative h-10 w-10 mt-1 overflow-hidden rounded-md">
                    <Image
                      fill
                      src={product.images[0].url}
                      alt="Image"
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="relative ml-4 flex flex-1 flex-col justify-between">
                    <div className="pr-4">
                      <p className="text-lg font-bold mb-1">{product.name}</p>
                      <Currency value={product.price} />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </form>
    </nav>
  );
};

export default MainNav;
