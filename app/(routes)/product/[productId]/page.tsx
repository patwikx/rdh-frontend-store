import getProduct from "@/actions/get-product";
import getProducts from "@/actions/get-products";
import Gallery from "@/components/gallery/intex";
import Info from "@/components/info";
import ProductList from "@/components/product-list";
import Container from "@/components/ui/container";

interface ProductPageProps {
    params: {
        productId: string;
    }
}

const ProductPage: React.FC<ProductPageProps> = async ({
    params
}) => {
    const product = await getProduct(params.productId);
    const suggestedProducts = await getProducts({
        categoryId: product?.category?.id
    })
  return (
    <div>
        <Container>
            <div className="px-4 py-4 sm:px-6 lg:px-8">
            <div className="md:grid md:grid-cols-2 md:items-start md:gap-x-8">
               <Gallery images={product.images} />
                <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                <Info data={product} />
                </div>
            </div>
            <hr className="my-10" />
            <ProductList title="Related Items" items={suggestedProducts} />
            </div>
        </Container>
        </div>
  )
}

export default ProductPage