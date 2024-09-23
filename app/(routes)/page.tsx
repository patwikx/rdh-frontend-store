import getBillboard from "@/actions/get-billboard";
import getProducts from "@/actions/get-products";
import Billboards from "@/components/billboard"
import ProductList from "@/components/product-list";
import Container from "@/components/ui/container"
import { useCurrentUser } from "@/hooks/use-current-user";

export const revalidate = 0;


const HomePage = async () => {

  const products = await getProducts({isFeatured: true})
  const billboard = await getBillboard("1821eed5-74de-4140-94bb-c46c5f9a0753");


  return (
    <Container>
      <div className="space-y-8 pb-5">
        <Billboards data={billboard} />
      
      <div>
      </div>
      <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
      <ProductList title="Featured Products" items={products} />
      </div>
      </div>
    </Container>
  )
}

export default HomePage