import React from 'react'
import { Metadata } from 'next'
import getCategory from "@/actions/get-category"
import getColors from "@/actions/get-colors"
import getProducts from "@/actions/get-products"
import getSizes from "@/actions/get-sizes"
import Billboards from "@/components/billboard"
import Container from "@/components/ui/container"
import CategoryClient from '@/components/category-client'


interface CategoryPageProps {
  params: {
    categoryId: string
  }
  searchParams: {
    colorId: string
    sizeId: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategory(params.categoryId)
  
  return {
    title: category?.name,
    description: `Browse our collection of ${category?.name}`,
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const products = await getProducts({
    categoryId: params.categoryId,
    colorId: searchParams.colorId,
    sizeId: searchParams.sizeId,
  })
  const sizes = await getSizes()
  const colors = await getColors()
  const category = await getCategory(params.categoryId)

  if (!category) {
    return <div>Category not found</div>
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Container>
        <Billboards data={category.billboard} />
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <CategoryClient 
            products={products}
            sizes={sizes}
            colors={colors}
            category={category}
          />
        </div>
      </Container>
    </div>
  )
}

export const revalidate = 3600 // revalidate every hour