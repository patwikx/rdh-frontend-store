"use client"

import { useRouter, useSearchParams } from "next/navigation"
import qs from "query-string"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Color, Size } from "@/types"

interface FilterProps {
  data: (Size | Color)[]
  name: string
  valueKey: string
}

export default function Filter({ data, name, valueKey }: FilterProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const selectedValue = searchParams.get(valueKey)

  const onClick = (id: string) => {
    const current = qs.parse(searchParams.toString())

    const query = {
      ...current,
      [valueKey]: id
    }

    if (current[valueKey] === id) {
      query[valueKey] = null
    }

    const url = qs.stringifyUrl({
      url: window.location.href,
      query
    }, { skipNull: true })

    router.push(url)
  }

  return (
    <div className="border-b border-gray-200 pb-4">
      <Accordion type="single" collapsible defaultValue={valueKey}>
        <AccordionItem value={valueKey} className="border-0">
          <AccordionTrigger className="flex justify-between py-3 text-sm font-medium hover:no-underline">
            {name}
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-2">
            <div className="space-y-4">
              {data.map((filter) => (
                <div key={filter.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={filter.id}
                    checked={selectedValue === filter.id}
                    onCheckedChange={() => onClick(filter.id)}
                    className="rounded-sm h-4 w-4 border-gray-300"
                  />
                  <Label
                    htmlFor={filter.id}
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {filter.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}