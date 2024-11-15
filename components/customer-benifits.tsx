import { Gift, Percent, Bell, Truck, ShoppingCart, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function MembershipBenefits() {
  const benefits = [
    {
      icon: Gift,
      title: "WELCOME OFFER",
    },
    {
      icon: Percent,
      title: "EXCLUSIVE DEALS",
    },
    {
      icon: Bell,
      title: "FIRST DIBS ON NEW DROPS",
    },
    {
      icon: Truck,
      title: "ORDER TRACKING",
    },
    {
      icon: ShoppingCart,
      title: "FASTER CHECKOUT",
    },
    {
      icon: RefreshCw,
      title: "30 DAY HASSLE-FREE EXCHANGES IN STORE*",
    },
  ]

  return (
    <div className="w-full bg-background">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Join the RDHFSI Club!</h2>
          <p className="text-muted-foreground">Perks of signing up:</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <benefit.icon className="h-12 w-12 mb-4" />
              <p className="text-sm font-medium">{benefit.title}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button className="bg-black text-white hover:bg-gray-800 px-8">
            GET 20% OFF*
          </Button>
        </div>
      </CardContent>
    </div>
  )
}