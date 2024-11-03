"use client"

import { useState, useRef } from "react"
import { Tab } from "@headlessui/react"
import Image from "next/image"

import { Image as ImageType } from "@/types"
import GalleryTab from "./gallery-tab"

interface GalleryProps {
    images: ImageType[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
    const imageRef = useRef<HTMLDivElement>(null)

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (imageRef.current) {
            const { left, top, width, height } = imageRef.current.getBoundingClientRect()
            const x = (event.clientX - left) / width
            const y = (event.clientY - top) / height
            setZoomPosition({ x, y })
        }
    }

    return (
        <div className="flex flex-col space-y-4">
            <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                    <Tab.Panels>
                        {images.map((image, index) => (
                            <Tab.Panel key={image.id}>
                                <div 
                                    ref={imageRef}
                                    className="aspect-square relative h-full w-full sm:rounded-lg overflow-hidden cursor-zoom-in"
                                    onMouseMove={handleMouseMove}
                                >
                                    <Image
                                        fill
                                        src={image.url}
                                        alt="Product image"
                                        className="object-cover object-center rounded-lg"
                                        sizes="(min-width: 1024px) 66vw, 100vw"
                                    />
                                    {selectedIndex === index && (
                                        <div 
                                            className="absolute inset-0 bg-white opacity-0 hover:opacity-100 transition-opacity duration-300"
                                            style={{
                                                backgroundImage: `url(${image.url})`,
                                                backgroundPosition: `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%`,
                                                backgroundSize: '250%',
                                                backgroundRepeat: 'no-repeat'
                                            }}
                                        />
                                    )}
                                </div>
                            </Tab.Panel>
                        ))}
                    </Tab.Panels>
                </div>
                <div className="mx-auto mt-6 w-full max-w-2xl lg:max-w-none">
                    <Tab.List className="grid grid-cols-4 gap-6">
                        {images.map((image) => (
                            <GalleryTab key={image.id} image={image} />
                        ))}
                    </Tab.List>
                </div>
            </Tab.Group>
        </div>
    )
}

export default Gallery