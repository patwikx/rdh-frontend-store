import getProduct from "@/actions/get-product";
import getProducts from "@/actions/get-products";
import { MembershipBenefits } from "@/components/customer-benifits";
import Gallery from "@/components/gallery/intex";
import Info from "@/components/info";
import ProductList from "@/components/product-list";

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
    });

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-screen-2xl mx-auto">
                <div className="px-4 py-8 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
                        <Gallery images={product.images} />
                        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                            <Info data={product} />
                        </div>
                    </div>
                </div>
                <hr className="my-12 border-gray-200" />
                <div className="px-4 py-8 sm:px-6 lg:px-8">
                    <ProductList title="Related Items" items={suggestedProducts} />
                    <div className="mt-8">
                <MembershipBenefits />
                </div>
                </div>


            </div>
        </div>
    );
}

export default ProductPage;