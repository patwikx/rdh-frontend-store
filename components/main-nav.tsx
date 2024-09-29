"use client"

import { cn } from "@/lib/utils";
import { Category } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation"
import { Input } from "./ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

interface MainNavProps {
    data: Category[];
};


const MainNav: React.FC<MainNavProps> = ({
    data
}) => {

    const pathname = usePathname();

    const routes = data.map((route) => ({
        href: `/category/${route.id}`,
        label: route.name,
        active: pathname === `/category/${route.id}`
    }));
  return (
    <nav
    className="mx-6 flex items-center space-x-4 lg:space-x-6"
    >
        {routes.map((route) => (
            <Link
            key={route.href}
            href={route.href}
            className={cn(
                "text-sm font-bold transition-colors hover:bg-transparent",
                route.active ? "text-black" : "text-neutral-500"
            )}
            >
                {route.label}
            </Link>
        ))}
    <div className="relative w-full md:w-80">
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <Input
        placeholder="Search items..."
        className="pl-10" // Add padding to the left to make space for the icon
      />
    </div>
    </nav>
  );
}

export default MainNav