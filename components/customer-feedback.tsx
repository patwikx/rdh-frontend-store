'use client'

import { useEffect, useState, useCallback } from 'react'
import { format } from 'date-fns'
import { Card, CardContent } from "@/components/ui/card"
import { StarIcon, Facebook } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useInView } from 'react-intersection-observer'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { CarouselApi } from "@/components/ui/carousel"

interface Feedback {
  id: string
  name: string
  content: string
  rating: number
  avatarUrl: string
  date: Date
  facebookUrl?: string
}

interface CustomerFeedbackProps {
  feedbacks: Feedback[]
  autoPlayInterval?: number
  className?: string
}

export default function CustomerFeedback({ 
  feedbacks,
  autoPlayInterval = 5000,
  className
}: CustomerFeedbackProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const { ref, inView } = useInView({
    threshold: 0.5,
  })

  useEffect(() => {
    if (!api) return

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  useEffect(() => {
    if (!api || !inView) return

    const intervalId = setInterval(() => {
      api.scrollNext()
    }, autoPlayInterval)

    return () => clearInterval(intervalId)
  }, [api, inView, autoPlayInterval])

  const handleDotClick = useCallback((index: number) => {
    api?.scrollTo(index)
  }, [api])

  return (
    <section 
      ref={ref} 
      className={cn(
        "py-16 bg-gradient-to-b from-background to-muted/50",
        className
      )}
    >
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Thousands of Happy Customers
          </h2>
          <div className="flex justify-center items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className="w-6 h-6 fill-primary text-primary"
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        <Carousel 
          setApi={setApi}
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {feedbacks.map((feedback, index) => (
              <CarouselItem 
                key={feedback.id} 
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-12 h-12 border-2 border-primary">
                        <AvatarImage 
                          src={feedback.avatarUrl} 
                          alt={`${feedback.name}'s avatar`} 
                        />
                        <AvatarFallback className="bg-primary/10">
                          {feedback.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold truncate">
                          {feedback.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={cn(
                                  "w-4 h-4",
                                  i < feedback.rating 
                                    ? "text-yellow-400 fill-yellow-400" 
                                    : "text-muted-foreground"
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(feedback.date), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-4">
                        {feedback.content}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-sm"
                        >
                          Read more
                        </Button>
                        {feedback.facebookUrl && (
                          <a 
                            href={feedback.facebookUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Facebook className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="flex items-center justify-center mt-8 space-x-2">
            {feedbacks.map((_, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className={cn(
                  "w-2 h-2 p-0 rounded-full",
                  current === index 
                    ? "bg-primary" 
                    : "bg-muted-foreground/20"
                )}
                onClick={() => handleDotClick(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  )
}