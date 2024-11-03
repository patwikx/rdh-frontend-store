'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { format } from 'date-fns'
import { Card, CardContent } from "@/components/ui/card"
import { StarIcon } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useInView } from 'react-intersection-observer'

interface Feedback {
  id: string
  name: string
  content: string
  rating: number
  avatarUrl: string
  date: Date
}

interface CustomerFeedbackProps {
  feedbacks: Feedback[]
}

export const CustomerFeedback = ({ feedbacks }: CustomerFeedbackProps) => {
  const [api, setApi] = useState<any>()
  const { ref, inView } = useInView({
    threshold: 0,
  })

  useEffect(() => {
    if (!api) return

    if (inView) {
      const intervalId = setInterval(() => {
        api.scrollNext()
      }, 3000)

      return () => clearInterval(intervalId)
    }
  }, [api, inView])

  return (
    <section ref={ref} className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">What Our Customers Say</h2>
        <Carousel 
          setApi={setApi} 
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {feedbacks.map((feedback) => (
              <CarouselItem key={feedback.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                      <Image
                        src={feedback.avatarUrl}
                        alt={`${feedback.name}'s avatar`}
                        width={32}
                        height={32}
                        className="rounded-full mr-2"
                        priority
                      />
                      <div>
                        <h3 className="font-semibold text-sm">{feedback.name}</h3>
                        <div className="flex items-center">
                          <div className="flex mr-2">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`w-3 h-3 ${
                                  i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            {format(new Date(feedback.date), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-3">{feedback.content}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  )
}