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
  const featuredProducts = await getProducts({ isFeatured: true })
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
          <Suspense fallback={<div>Loading featured products...</div>}>
            <FeaturedProducts searchTerm={searchTerm} />
          </Suspense>
          <Suspense fallback={<ProductCarouselSkeleton />}>
            <CategoryCarousel 
              title="Office Supplies" 
              categoryId="49c79d92-8d41-4819-98e2-3d20be12dd95"
            />
          </Suspense>
          <Suspense fallback={<ProductCarouselSkeleton />}>
            <CategoryCarousel 
              title="Construction Supplies" 
              categoryId="a657c9bd-e161-4c96-92d2-f1bc12f3c277"
            />
          </Suspense>
          <Suspense fallback={<ProductCarouselSkeleton />}>
            <CategoryCarousel 
              title="Industrial Supplies" 
              categoryId="bd375b65-d09b-409c-b63c-ffd34540d5cc"
            />
          </Suspense>
          <Suspense fallback={<ProductCarouselSkeleton />}>
            <CategoryCarousel 
              title="Fishing Supplies" 
              categoryId="048561d8-9493-4c2d-8a63-1c11ac15f718"
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