'use client'

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import axios from "axios"
import { HandCoins, Truck } from "lucide-react"
import { toast } from "sonner"

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

type UploadThingFile = {
  url: string
  name: string
}

const Summary = () => {
  const searchParams = useSearchParams()
  const items = useCart((state) => state.items)
  const removeAll = useCart((state) => state.removeAll)
  const session = useCurrentUser()
  
  const [loading, setLoading] = useState(false)
  const [companyName, setCompanyName] = useState("")
  const [poNumber, setPoNumber] = useState("")
  const [address, setAddress] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [deliveryMethod, setDeliveryMethod] = useState("pick-up")
  const [uploadedFileUrls, setUploadedFileUrls] = useState<string[]>([])
  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([])
  const [attachedPOUrl, setApprovedPOUrl] = useState("")

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Order completed.")
      removeAll()
    }

    if (searchParams.get("canceled")) {
      toast.error("Something went wrong.")
    }
  }, [searchParams, removeAll])

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price) * item.quantity
  }, 0)

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
        deliveryMethod, // Include deliveryMethod in the API call
        companyName,
        poNumber,
        address: deliveryMethod === "delivery" ? address : "",
        contactNumber,
        attachedPOUrl,
        clientName: session.name,
        clientEmail: session.email,
      })

      if (response.status === 201) {
        toast.success("Order created successfully! Redirecting...")

        // Send an email with the order summary
        await axios.post("/api/send-email", {
          to: session.email,
          name: session.name,
          subject: "Order Confirmation",
          body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
            <h2 style="color: #333;">Thank you for your order, ${session.name}!</h2>
            <p style="color: #555;">We've received your order and it's now being processed. Below is your order confirmation:</p>

            <h3 style="color: #333; margin-top: 30px;">Order Details</h3>
            <p style="color: #555;">PO #: <strong>${poNumber}</strong></p>
            <p style="color: #555;">Delivery Method: <strong>${deliveryMethod}</strong></p>
            <p style="color: #555;">Delivery Address: <strong>${address || 'N/A (Pick-up)'}</strong></p>
            <p style="color: #555;">Contact Number: <strong>${contactNumber}</strong></p>

            <h3 style="color: #333; margin-top: 30px;">Order Summary</h3>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr>
                  <th style="text-align: left; padding: 10px; border-bottom: 2px solid #eee;">Product</th>
                  <th style="text-align: center; padding: 10px; border-bottom: 2px solid #eee;">Quantity</th>
                  <th style="text-align: center; padding: 10px; border-bottom: 2px solid #eee;">Price</th>
                  <th style="text-align: center; padding: 10px; border-bottom: 2px solid #eee;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${items.map(
                  (item) => `
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">
                      <img src="${item.images[0].url}" alt="${item.name}" style="width: 50px; height: 50px; margin-right: 10px; vertical-align: middle; border: 1px solid #ddd;">
                      <span>${item.name}</span>
                    </td>
                    <td style="text-align: center; padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
                    <td style="text-align: center; padding: 10px; border-bottom: 1px solid #eee;">₱ ${Number(item.price).toFixed(2)}</td>
                    <td style="text-align: center; padding: 10px; border-bottom: 1px solid #eee;">₱ ${(Number(item.price) * item.quantity).toFixed(2)}</td>
                  </tr>
                `
                ).join('')}
              </tbody>
            </table>

            <p style="font-size: 18px; color: #333; text-align: right; margin-top: 20px;">Total: <strong>₱ ${totalPrice.toFixed(2)}</strong></p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">

            <p style="color: #555;">If you have any questions about your order, feel free to <a href="mailto:support@example.com" style="color: #0066cc; text-decoration: none;">contact our support team</a>.</p>

            <p style="color: #555;">Thank you for shopping with us!</p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">

            <p style="color: #555;">Stay connected with us:</p>
            <p style="color: #555;">
              <strong>Facebook:</strong> <a href="https://www.facebook.com/rdhfsi" style="color: #0066cc; text-decoration: none;">www.facebook.com/rdhfsi</a><br>
              <strong>Contact Number:</strong> 0912-394-5678<br>
              <strong>Branch Address:</strong> Santiago Boulevard, General Santos City, Philippines, 9500
            </p>
          </div>`
        })

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


    return (
        <div className="mt-16 rounded-lg border border-gray-200 bg-white shadow-sm px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
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
                    <div className="text-base font-bold">Total</div>
                    <Currency value={totalPrice} />
                </div>
            </div>
            <div className="mt-4">
                <Separator />
            </div>
            <div className="mt-6">
            <RadioGroup value={deliveryMethod} onValueChange={(value) => setDeliveryMethod(value)}>
          <div className="flex items-center justify-center space-x-2">
            <RadioGroupItem value="pick-up" id="r2" />
            <Label htmlFor="r2" className="font-bold">Pick-up</Label>
            <HandCoins size={20} />
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="delivery" id="r3" className="ml-16 border-b" />
              <Label htmlFor="r3" className="font-bold">Delivery</Label>
              <Truck className="ml-2" size={20} />
            </div>
          </div>
        </RadioGroup>
      </div>

      <div className="mt-6">
        <label className="mt-6 font-bold text-xl">
          Order Information
        </label>
      </div>
      <div className="mt-2 space-y-4">
        <label className="block">
          <span className="font-semibold text-md">Company Name</span>
          <Input
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </label>
        <label className="block">
          <span className="font-semibold text-md">PO #</span>
          <Input
            type="text"
            placeholder="PO #"
            value={poNumber}
            onChange={(e) => setPoNumber(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </label>
        <label className="block">
          <span className="font-semibold text-md">Contact Number</span>
          <Input
            type="text"
            placeholder="Contact Number"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </label>
      </div>

            {deliveryMethod === "delivery" && (
                <>
          <div className="mt-6">
            <label className="mt-6 font-bold text-xl">
              Delivery Information
            </label>
          </div>
          <div className="mt-2 space-y-4">
            <label className="block">
              <span className="font-semibold text-md">Address</span>
              <Input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </label>
          </div>
        </>
            )}
<div className="mt-2 flex flex-col items-center justify-center">
        <label className="block text-center">
          <div className="flex flex-col items-center mt-4">
            <label className="flex flex-col items-center p-4 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-gray-600 transition duration-300">
              <span className="text-center font-bold text-md mb-2 text-gray-600">Attach Approved P.O</span>
              <UploadButton
                endpoint="approvedPOUrl"
                onClientUploadComplete={handleFileUpload}
                onUploadError={(error: Error) => {
                  toast.error(`Upload ERROR! ${error.message}`)
                }}
              />
              <div className="flex flex-col items-center">
                <span className="text-gray-500">Drag & Drop or Click to Upload</span>
              </div>
            </label>
          </div>
        </label>
        {uploadedFileNames.length > 0 && (
          <div className="mt-2 text-sm text-gray-600">
            <Label className="font-bold">Uploaded file: </Label>
            <ul className="list-disc pl-5">
              <li>{uploadedFileNames[0]}</li>
            </ul>
          </div>
        )}
      </div>

            {loading ? (
                <div className="flex items-center justify-center mt-6">
                    <Loader />
                </div>
            ) : (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="w-full mt-6">Place order</Button>
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
            )}
        </div>
    );
};

export default Summary;