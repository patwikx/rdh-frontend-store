import getBillboard from "@/actions/get-billboard";
import getProducts from "@/actions/get-products";
import Billboards from "@/components/billboard";
import ProductList from "@/components/product-list";
import Container from "@/components/ui/container";

interface HomePageProps {
  searchParams: {
    search?: string; // Optional search parameter
  };
}

export const revalidate = 0;

const HomePage = async ({ searchParams }: HomePageProps) => {
  const searchTerm = searchParams.search || ""; // Get the search term from query parameters

  const products = await getProducts({ isFeatured: true });
  const billboard = await getBillboard("1821eed5-74de-4140-94bb-c46c5f9a0753");

  // Filter products based on the search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <div className="space-y-8 pb-5">
        <Billboards data={billboard} />
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <ProductList title="Featured Products" items={filteredProducts} />
        </div>
      </div>
    </Container>
  );
}

export default HomePage;
