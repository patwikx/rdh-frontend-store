import Link from "next/link"


const Footer = () => {
  return (
    <footer className="border-t">
        <div className="flex items-center justify-center mx-auto py-6">
        <div className="text-center text-xs mt-[-4px]">
           &copy; 2024 RD Hardware & Fishing Supply, Inc. All rights reserved.
           <div className="mt-2">
           <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{''}
           </div>
           <div className="mt-2 mb-[-12px]">
           <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
           </div>

        </div>

        </div>
    </footer>
  )
}

export default Footer