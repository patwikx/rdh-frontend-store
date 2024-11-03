'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSearchParams } from "next/navigation"
import axios from "axios"
import { Building2, CalendarIcon, ChevronRight, FileCheck, FileText, HandCoins, MapPin, Phone, Truck } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

import Currency from "@/components/ui/currency"
import { Loader } from "@/components/ui/loader"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import useCart from "@/hooks/use-cart"
import { useCurrentUser } from "@/hooks/use-current-user"
import { UploadButton } from "@/utils/uploadthing"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"


type UploadThingFile = {
  url: string
  name: string
}

const SHIPPING_RATES: Record<string, number> = {
  "Lagao": 150,
  "Calumpang": 200,
  "Uhaw": 250,
  "Alabel": 300
}

export default function Summary() {
  const searchParams = useSearchParams()
  const items = useCart((state) => state.items)
  const removeAll = useCart((state) => state.removeAll)
  const session = useCurrentUser()
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [companyName, setCompanyName] = useState("")
  const [poNumber, setPoNumber] = useState("")
  const [address, setAddress] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [deliveryMethod, setDeliveryMethod] = useState("pick-up")
  const [uploadedFileUrls, setUploadedFileUrls] = useState<string[]>([])
  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([])
  const [attachedPOUrl, setApprovedPOUrl] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [region, setRegion] = useState<keyof typeof SHIPPING_RATES | "">("")


  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price) * item.quantity
  }, 0)

  const shippingFee = region && deliveryMethod === "delivery" ? SHIPPING_RATES[region] : 0
  const finalTotal = totalPrice + shippingFee

  const handleFileUpload = (res: UploadThingFile[]) => {
    if (res && res.length > 0) {
      const fileUrl = res[0].url
      const fileName = res[0].name
      setApprovedPOUrl(fileUrl)
      setUploadedFileUrls([fileUrl])
      setUploadedFileNames([fileName])
      toast.success("Upload Completed")
    }
  }

  const onCheckout = async () => {
    if (!session || !session.email) {
      toast.error("You must log in first before proceeding.")
      return
    }

    if (items.length === 0) {
      toast.error("No items in the cart.")
      return
    }

    if (!companyName || !poNumber || !contactNumber || !attachedPOUrl) {
      toast.error("Company Name, PO #, and Contact Number are required.")
      return
    }

    if (deliveryMethod === "delivery" && !address) {
      toast.error("Please fill in the delivery address.")
      return
    }

    if (uploadedFileUrls.length === 0) {
      toast.error("Please upload the approved P.O.")
      return
    }

    const missingQuantities = items.some(item => !item.quantity || item.quantity <= 0)
    if (missingQuantities) {
      toast.error("Quantities must be provided for all product IDs.")
      return
    }

    setLoading(true)

    try {
      const orderItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        totalItemAmount: Number(item.price) * item.quantity
      }))

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
        orderItems,
        deliveryMethod,
        companyName,
        poNumber,
        address: deliveryMethod === "delivery" ? address : "",
        contactNumber,
        attachedPOUrl,
        clientName: session.name,
        clientEmail: session.email,
        shippingFee,
        totalAmount: finalTotal,
      })

      if (response.status === 201) {
        toast.success("Order created successfully! Redirecting...")
        removeAll()
        setTimeout(() => {
          window.location.href = response.data.redirectUrl || "/"
        }, 500)
      } else {
        toast.error("Checkout failed. Please try again.")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error("There was an error processing your order.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mt-16 rounded-lg border border-gray-200 bg-white shadow-sm px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
    >
      {/* Breadcrumb */}
      <nav className="flex mb-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <a href="#" className={`inline-flex items-center text-sm ${step === 1 ? 'font-bold text-primary' : 'font-medium text-gray-700 hover:text-primary'}`}>
              Delivery Options
            </a>
          </li>
          <li>
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <a href="#" className={`ml-1 text-sm ${step === 2 ? 'font-bold text-primary' : 'font-medium text-gray-700 hover:text-primary'} md:ml-2`}>
                Order Summary
              </a>
            </div>
          </li>
        </ol>
      </nav>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-bold mb-4">Delivery Options</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-md font-medium mb-2">Delivery method</h3>
                <RadioGroup
                  value={deliveryMethod}
                  onValueChange={setDeliveryMethod}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className={`flex items-center justify-center gap-2 p-4 border rounded-lg cursor-pointer ${deliveryMethod === "pick-up" ? "border-primary" : "border-gray-200"}`}>
                    <RadioGroupItem value="pick-up" id="pick-up" />
                    <Label htmlFor="pick-up" className="cursor-pointer">Pick-up in store</Label>
                    <HandCoins className="h-5 w-5" />
                  </div>
                  <div className={`flex items-center justify-center gap-2 p-4 border rounded-lg cursor-pointer ${deliveryMethod === "delivery" ? "border-primary" : "border-gray-200"}`}>
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery" className="cursor-pointer">Delivery</Label>
                    <Truck className="h-5 w-5" />
                  </div>
                </RadioGroup>
              </div>

              {deliveryMethod === "pick-up" && (
                <div>
                  <h3 className="text-md font-medium mb-2">Pickup date & time</h3>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                        <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {deliveryMethod === "delivery" && (
                <div>
                  <h3 className="text-md font-medium mb-2">Delivery Location</h3>
                  <Select value={region} onValueChange={(value) => setRegion(value as keyof typeof SHIPPING_RATES)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your region" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(SHIPPING_RATES).map(([region, rate]) => (
                        <SelectItem key={region} value={region}>
                          {region} 
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <h3 className="text-md font-medium mb-2">Order Information</h3>
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Company Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full"
                    required
                  />
                  <Input
                    type="text"
                    placeholder="PO #"
                    value={poNumber}
                    onChange={(e) => setPoNumber(e.target.value)}
                    className="w-full"
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Contact Number"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full"
                    required
                  />
                  {deliveryMethod === "delivery" && (
                    <Input
                      type="text"
                      placeholder="Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full"
                      required
                    />
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium mb-2">Attach Approved P.O</h3>
                <div className="flex flex-col items-center p-4 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-gray-600 transition duration-300">
                  <UploadButton
                    endpoint="approvedPOUrl"
                    onClientUploadComplete={handleFileUpload}
                    onUploadError={(error: Error) => {
                      toast.error(`Upload ERROR! ${error.message}`)
                    }}
                  />
                  <span className="text-gray-500 mt-2">Drag & Drop or Click to Upload</span>
                </div>
                {uploadedFileNames.length > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    <Label className="font-bold">Uploaded file: </Label>
                    <ul className="list-disc pl-5">
                      <li>{uploadedFileNames[0]}</li>
                    </ul>
                  </div>
                )}
              </div>

              <Button className="w-full mt-6" onClick={() => setStep(2)}>Next</Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-bold">Order Summary</h2>
            <div className="mt-6 space-y-4">
              <ul className="list-disc ml-5">
                {items.map((item) => (
                  <li key={item.id} className="text-sm">
                    <div className="flex flex-row">
                      <span>{item.name}</span>
                      <span className="ml-4"> ({item.quantity})</span>
                      <div className="flex flex-row ml-auto items-end">
                        <Currency value={Number(item.price) * item.quantity} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t pt-4">
                <div className="text-base font-medium">Subtotal</div>
                <Currency value={totalPrice} />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-base font-medium">Shipping Fee</div>
                <Currency value={shippingFee} />
              </div>
              <div className="flex items-center justify-between border-t pt-4">
                <div className="text-base font-bold">Total</div>
                <Currency value={finalTotal} />
              </div>
            </div>
 {/* Enhanced Order Details section */}
 <div>
          <h2 className="text-xl font-semibold mb-6">Order Details</h2>
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Information */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Company Name</p>
                    <p className="font-medium">Anchor Hotel</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Contact Number</p>
                    <p className="font-medium">09123934567</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">PO #</p>
                    <p className="font-medium">PO #51251</p>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery Method</p>
                    <p className="font-medium">Pick-up</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CalendarIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Pickup Date</p>
                    <p className="font-medium">November 13th, 2024</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FileCheck className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Attached File</p>
                    <p className="font-medium">rd4.jpg</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button>Place order</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onCheckout}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <Loader />
        </div>
      )}
    </motion.div>
  )
}