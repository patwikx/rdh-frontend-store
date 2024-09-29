import Link from "next/link";
import Container from "./ui/container";
import MainNav from "./main-nav";
import getCategories from "@/actions/get-categories";
import NavbarActions from "./navbar-actions";
import Image from "next/image";
import getProducts from "@/actions/get-products";

export const revalidate = 0;

const Navbar = async () => {
  const categories = await getCategories();
  const products = await getProducts({ isFeatured: true }); 

  return (
    <div className="border-b">
      <Container>
        <div className="relative flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="ml-4 flex lg:ml-0 gap-x-2 items-center">
            <Image
              src="/RDH.webp"
              alt="RDHFSI Store Logo"
              width={35}
              height={25}
              className="h-auto w-10 sm:w-12" // Adjust width for mobile and larger screens
            />
            <p className="font-bold text-xl">RDHFSI Store</p>
          </Link>
          <div className="hidden md:flex">
            <MainNav data={categories} products={products} />
          </div>
          <div className="flex md:hidden">
{/** */}
          </div>
          <NavbarActions />
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
