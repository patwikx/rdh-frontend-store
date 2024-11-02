'use client'

import React, { useEffect, useState } from 'react'
import { Billboard } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Autoplay from "embla-carousel-autoplay"

interface BillboardProps {
  data: Billboard
}

const Billboards: React.FC<BillboardProps> = ({ data }) => {
  const [api, setApi] = useState<any>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  const hasValidImage = data && data.imageUrl && data.imageUrl.length > 0

  const carouselItems = [
    { label: "Christmas Sale! Up to 50% off", color: "bg-red-500" },
    { label: "New Arrivals in Fishing Supplies", color: "bg-blue-500" },
    { label: "Hardware Essentials for Your Home", color: "bg-green-500" },
    { label: "Industrial Essential Equipments", color: "bg-yellow-500" },
    { label: "Office Supplies Sale Up to 25% off", color: "bg-orange-500" },
  ]

  if (hasValidImage) {
    return (
      <div className="p-2 sm:p-6 lg:p-8 rounded-xl overflow-hidden">
        <div
          className="rounded-xl relative aspect-square md:aspect-[4.0/1] overflow-hidden bg-cover"
          style={{
            backgroundImage: `url(${data.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="h-full w-full flex flex-col justify-center items-center text-center gap-y-8">
            <div className="font-bold text-3xl sm:text-5xl lg:text-6xl sm:max-w-xl max-w-xs">
              {data.label}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-2 sm:p-6 lg:p-8 rounded-xl overflow-hidden">
      <Carousel
        setApi={setApi}
        className="w-full"
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
      >
        <CarouselContent>
          {carouselItems.map((item, index) => (
            <CarouselItem key={index}>
              <Card className={`${item.color} rounded-xl relative aspect-square md:aspect-[4.0/1] overflow-hidden`}>
                <CardContent className="h-full flex flex-col justify-center items-center text-center p-6">
                  <h2 className="font-bold text-3xl sm:text-5xl lg:text-6xl text-white">
                    {item.label}
                  </h2>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {Array.from({ length: count }).map((_, index) => (
            <Button
              key={index}
              variant={current === index + 1 ? "default" : "outline"}
              size="icon"
              className="w-2 h-2 rounded-full"
              onClick={() => api?.scrollTo(index)}
            >
              <span className="sr-only">Go to slide {index + 1}</span>
            </Button>
          ))}
        </div>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2">
          <ChevronLeft className="h-6 w-6" />
        </CarouselPrevious>
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2">
          <ChevronRight className="h-6 w-6" />
        </CarouselNext>
      </Carousel>
    </div>
  )
}

export default Billboards