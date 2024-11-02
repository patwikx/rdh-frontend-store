import { addDays, subDays, format } from 'date-fns'
import getBillboard from "@/actions/get-billboard"
import getProducts from "@/actions/get-products"
import Billboards from "@/components/billboard"
import ProductList from "@/components/product-list"
import CustomerFeedback from '@/components/customer-feedback'


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
    name: 'Arnold Nicolas',
    content: 'Great products and fast shipping! Will definitely buy again.',
    rating: 5,
    avatarUrl: 'https://utfs.io/f/CvBEyUsPwX7B7afB4TJ8OJiqhH6YyZGvzNfBo1CAPIbj2kX0',
    date: subDays(new Date(), Math.floor(Math.random() * 30))
  },
  {
    id: '2',
    name: 'Gerold Garin',
    content: 'The quality of the items exceeded my expectations. Highly recommended!',
    rating: 4,
    avatarUrl: 'https://utfs.io/f/CvBEyUsPwX7BjzGpe0WikdZnQmwRSeDW5A6b9PlKYzgB3JEI',
    date: subDays(new Date(), Math.floor(Math.random() * 30))
  },
  {
    id: '3',
    name: 'Larry Paler',
    content: 'Excellent customer service. They quickly resolved an issue I had with my order.',
    rating: 5,
    avatarUrl: 'https://utfs.io/f/CvBEyUsPwX7BPdTr5mEmlxRKCHGfh8pBgtQo0uSIb9nEOLX7',
    date: subDays(new Date(), Math.floor(Math.random() * 30))
  },
  {
    id: '4',
    name: 'Argie Tacay',
    content: 'I love the variety of products available. Something for everyone!',
    rating: 5,
    avatarUrl: 'https://utfs.io/f/CvBEyUsPwX7BCJEoVzsPwX7BtS1nQxljJhrL8kK05GMop2R4',
    date: subDays(new Date(), Math.floor(Math.random() * 30))
  },
  {
    id: '5',
    name: 'Cezar Regalado',
    content: 'The website is easy to navigate and the checkout process is smooth.',
    rating: 4,
    avatarUrl: 'https://utfs.io/f/CvBEyUsPwX7BfGhyk0QTKhGEd16CWeLZMHJRSxtk2vXI9sNl',
    date: subDays(new Date(), Math.floor(Math.random() * 30))
  }
]

export const revalidate = 0

export default async function HomePage({ searchParams }: HomePageProps) {
  const searchTerm = searchParams.search || ""

  const featuredProducts = await getProducts({ isFeatured: true })
  const officeSupplies = await getProducts({ categoryId: "dd32aa8a-5652-4e66-8875-b00eefd7a88c" })
  const constructionSupplies = await getProducts({ categoryId: "1ed2e1ae-e21c-41f5-8ea9-e905afc23887" })
  const industrialSupplies = await getProducts({ categoryId: "06a6d0a3-1fb4-482f-9e2e-cceaf965b90d" })
  const billboard = await getBillboard("1821eed5-74de-4140-94bb-c46c5f9a0753")

  const filteredProducts = featuredProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-full">
      <div className="space-y-10 pb-10">
        <Billboards data={billboard} />
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <ProductList title="Popular Products" items={filteredProducts} />
          <ProductList title="Office Supplies" items={officeSupplies} />
          <ProductList title="Construction Supplies" items={constructionSupplies} />
          <ProductList title="Industrial Supplies" items={industrialSupplies} />
          <CustomerFeedback feedbacks={mockFeedbacks} />
        </div>
      </div>
    </div>
  )
}