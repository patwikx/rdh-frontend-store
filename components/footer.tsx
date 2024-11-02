'use client'

import { useState } from 'react'
import Link from "next/link"
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock, Youtube, Linkedin, Rss } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "./use-toast"

export default function Footer() {
  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value
    toast({
      title: "Subscribed!",
      description: "You've successfully subscribed to our newsletter.",
    })
  }

  return (
    <footer className="bg-muted">
      <div className="container mx-auto px-4 py-12">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Description */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold mb-4">RD Hardware & Fishing Supply, Inc.</h2>
            <p className="text-muted-foreground mb-6">
              As your trusted hardware and fishing destination, we create endless possibilities through an ever-expanding range of products from the most coveted brands, putting you at the centre of it all.
            </p>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">CUSTOMER SERVICE</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
              <li><Link href="/size-guide" className="hover:text-primary">Size Guide</Link></li>
              <li><Link href="/returns" className="hover:text-primary">Exchanges & Returns</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
              <li><Link href="/gift-cards" className="hover:text-primary">Buy Gift Cards</Link></li>
              <li><Link href="/products" className="hover:text-primary">Product Index</Link></li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">ABOUT US</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary">Who We Are</Link></li>
              <li><Link href="/careers" className="hover:text-primary">Careers</Link></li>
              <li><Link href="/promotions" className="hover:text-primary">Promotions</Link></li>
              <li><Link href="/sustainability" className="hover:text-primary">Sustainability Strategy</Link></li>
              <li><Link href="/affiliate" className="hover:text-primary">The Affiliate Program</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">NEW TO RD HARDWARE?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get the latest hardware and fishing news and product launches just by subscribing to our newsletter.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-4">
              <Input
                type="email"
                name="email"
                placeholder="Your email address"
                className="w-full"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <Button className="w-full">
                  SUBSCRIBE
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                By signing up, you agree to our <Link href="/privacy" className="underline">Privacy Policy</Link>
              </p>
            </form>
          </div>
        </div>

        {/* Social Links and Apps */}
        <div className="border-t border-border pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Social Media */}
            <div>
              <h4 className="font-semibold mb-4">FIND US ON</h4>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="#"><Facebook className="h-5 w-5" /></Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="#"><Instagram className="h-5 w-5" /></Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="#"><Twitter className="h-5 w-5" /></Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="#"><Youtube className="h-5 w-5" /></Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="#"><Linkedin className="h-5 w-5" /></Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="#"><Rss className="h-5 w-5" /></Link>
                </Button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="text-sm text-muted-foreground">
              <p>Any question? Let us help you.</p>
              <div className="flex items-center mt-2">
                <Link href="/contact" className="text-primary hover:underline">Contact</Link>
                <span className="mx-2">|</span>
                <Link href="/help" className="text-primary hover:underline">Help</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="border-t border-border mt-8 pt-8 text-sm text-muted-foreground">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex flex-wrap gap-4">
              <Link href="/about" className="hover:text-primary">About</Link>
              <span>|</span>
              <Link href="/privacy" className="hover:text-primary">Privacy</Link>
              <span>|</span>
              <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
            </div>
            <div>
              ©{new Date().getFullYear()} RD Hardware & Fishing Supply Inc.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}