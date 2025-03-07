import { Suspense } from 'react'
import { subDays } from 'date-fns'
import getBillboard from "@/actions/get-billboard"
import getProducts from "@/actions/get-products"
import Billboards from "@/components/billboard"
import ProductList from "@/components/product-list"
import { CustomerFeedback } from '@/components/customer-feedback'
import ProductCarousel from './cart/components/popular-items'
import { MembershipBenefits } from '@/components/customer-benifits'
import { ProductCarouselSkeleton } from '@/components/carousel-skeletons'
import { Loader } from '@/components/ui/loader'

export const revalidate = 0;

interface HomePageProps {
  searchParams: {
    search?: string
  }
}

interface Feedback {
  id: string
  name: string
  content: string
  rating: number
  avatarUrl: string
  date: Date
}
const mockFeedbacks: Feedback[] = [
  {
    id: '1',
    name: 'Arnold N.',
    content: 'Great products and fast shipping! Will definitely buy again.',
    rating: 5,
    avatarUrl: 'https://utfs.io/f/CvBEyUsPwX7B7afB4TJ8OJiqhH6YyZGvzNfBo1CAPIbj2kX0',
    date: subDays(new Date(), Math.floor(Math.random() * 30))
  },
  {
    id: '2',
    name: 'Gerold G.',
    content: 'The quality of the items exceeded my expectations. Highly recommended!',
    rating: 4,
    avatarUrl: 'https://utfs.io/f/CvBEyUsPwX7BjzGpe0WikdZnQmwRSeDW5A6b9PlKYzgB3JEI',
    date: subDays(new Date(), Math.floor(Math.random() * 30))
  },
  {
    id: '3',
    name: 'Larry P.',
    content: 'Excellent customer service. They quickly resolved an issue I had with my order.',
    rating: 5,
    avatarUrl: 'https://utfs.io/f/CvBEyUsPwX7BPdTr5mEmlxRKCHGfh8pBgtQo0uSIb9nEOLX7',
    date: subDays(new Date(), Math.floor(Math.random() * 30))
  },
  {
    id: '4',
    name: 'Argie T.',
    content: 'I love the variety of products available. Something for everyone!',
    rating: 5,
    avatarUrl: 'https://utfs.io/f/CvBEyUsPwX7BCJEoVzsPwX7BtS1nQxljJhrL8kK05GMop2R4',
    date: subDays(new Date(), Math.floor(Math.random() * 30))
  },
  {
    id: '5',
    name: 'Cezar R.',
    content: 'The website is easy to navigate and the checkout process is smooth.',
    rating: 4,
    avatarUrl: 'https://utfs.io/f/CvBEyUsPwX7BfGhyk0QTKhGEd16CWeLZMHJRSxtk2vXI9sNl',
    date: subDays(new Date(), Math.floor(Math.random() * 30))
  }
]


async function FeaturedProducts({ searchTerm }: { searchTerm: string }) {
  const featuredProducts = await getProducts({})
  const filteredProducts = featuredProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  return <ProductList title="Popular Products" items={filteredProducts} />
}

async function CategoryCarousel({ title, categoryId }: { title: string, categoryId: string }) {
  const products = await getProducts({ categoryId })
  return <ProductCarousel title={title} items={products} categoryId={categoryId} />
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const searchTerm = searchParams.search || ""
  const billboardPromise = getBillboard("1821eed5-74de-4140-94bb-c46c5f9a0753")

  return (
    <div className="w-full">
      <div className="space-y-10 pb-10">
       
          <BillboardSection promise={billboardPromise} />

        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <Suspense>
            <FeaturedProducts searchTerm={searchTerm} />
          </Suspense>
          <Suspense fallback={<ProductCarouselSkeleton />}>
            <CategoryCarousel 
              title="Construction Supplies" 
              categoryId="97012272-31fd-49f9-a288-5ce9e03c94ba"
            />
          </Suspense>
          <Suspense fallback={<ProductCarouselSkeleton />}>
            <CategoryCarousel 
              title="Industrial Supplies" 
              categoryId="f4577152-01d5-4869-ab79-be3a377cd9fe"
            />
          </Suspense>
          <Suspense fallback={<ProductCarouselSkeleton />}>
            <CategoryCarousel 
              title="Fishing Supplies" 
              categoryId="77d44069-20bb-4078-9507-51be4876f9ca"
            />
          </Suspense>
          <Suspense fallback={<ProductCarouselSkeleton />}>
            <CategoryCarousel 
              title="Electrical Supplies" 
              categoryId="fbdd6f73-a9e1-4ce2-aaa7-91151e263e74"
            />
          </Suspense>
                   <Suspense fallback={<ProductCarouselSkeleton />}>
            <CategoryCarousel 
              title="D-I-Y Supplies" 
              categoryId="8650fed0-d981-48e0-87ed-9e4c58689d2e"
            />
          </Suspense>
          <Suspense fallback={<ProductCarouselSkeleton />}>
            <CategoryCarousel 
              title="Office Supplies" 
              categoryId="33261320-c18d-4cd9-ab70-450290d82739"
            />
          </Suspense>
          
          <MembershipBenefits />
          <CustomerFeedback feedbacks={mockFeedbacks} />
        </div>
      </div>
    </div>
  )
}

async function BillboardSection({ promise }: { promise: Promise<any> }) {
  const billboard = await promise
  return <Billboards data={billboard} />
}