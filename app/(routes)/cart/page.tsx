
import getProducts from "@/actions/get-products"
import CheckoutPage from './components/check-outpage'
import ProductCarousel from './components/popular-items'
import { MembershipBenefits } from '@/components/customer-benifits'

export const revalidate = 0

export default async function FeaturedItems() {
  const featuredProducts = await getProducts({ isFeatured: true })

  return (
    <div className="w-full">
      <div className="space-y-10 pb-10">
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <CheckoutPage />
          <div className='mt-[-30px]'>
            <ProductCarousel 
              title="Popular Products" 
              items={featuredProducts} 
              categoryId="featured"
            />
            <div className='mt-8'>
            <MembershipBenefits />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}