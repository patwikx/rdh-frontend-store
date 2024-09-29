import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const PrivacyPolicy = () => {
  return (
    <Container>
      <Card className="p-8 md:p-10 space-y-6 bg-gray-50 shadow-lg rounded-lg mt-4">
        <h1 className="text-4xl font-extrabold text-center">Privacy Policy</h1>
        <p className="text-lg text-center text-gray-700">
          This Privacy Policy outlines how RD Hardware & Fising Supply, Inc. collects, uses, and protects your information.
        </p>

        <Separator className="my-6" />

        <h2 className="text-3xl font-semibold">1. Information We Collect</h2>
        <p className="text-gray-600">
          We may collect personal information from you when you:
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Register on our site</li>
          <li>Place an order</li>
          <li>Subscribe to our newsletter</li>
          <li>Interact with our customer service</li>
        </ul>
        <p className="text-gray-600">
          The types of information we may collect include your name, email address, phone number, mailing address, 
          payment information, and any other details you provide to us.
        </p>

        <Separator className="my-4" />

        <h2 className="text-3xl font-semibold">2. How We Use Your Information</h2>
        <p className="text-gray-600">
          We may use your information for various purposes, including:
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>To provide and maintain our services</li>
          <li>To process your transactions</li>
          <li>To improve our website and services</li>
          <li>To send periodic emails regarding your order or other products and services</li>
          <li>To respond to inquiries and support needs</li>
        </ul>

        <Separator className="my-4" />

        <h2 className="text-3xl font-semibold">3. Data Protection</h2>
        <p className="text-gray-600">
          We implement a variety of security measures to maintain the safety of your personal information. 
          We use encryption to protect sensitive information transmitted online and restrict access to personal data 
          to authorized personnel only.
        </p>

        <Separator className="my-4" />

        <h2 className="text-3xl font-semibold">4. Sharing Your Information</h2>
        <p className="text-gray-600">
          We do not sell, trade, or otherwise transfer your personal information to outside parties without your 
          consent, except to provide the services you request or comply with the law.
        </p>

        <Separator className="my-4" />

        <h2 className="text-3xl font-semibold">5. Your Rights</h2>
        <p className="text-gray-600">
          You have the right to:
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Request access to the personal information we hold about you</li>
          <li>Request correction of your personal information</li>
          <li>Request deletion of your personal information</li>
          <li>Object to or restrict our processing of your personal information</li>
          <li>Withdraw consent to our processing of your personal information</li>
        </ul>

        <Separator className="my-4" />

        <h2 className="text-3xl font-semibold">6. Changes to This Privacy Policy</h2>
        <p className="text-gray-600">
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
          the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically 
          for any changes.
        </p>

        <Separator className="my-4" />

        <h2 className="text-3xl font-semibold">7. Contact Us</h2>
        <p className="text-gray-600">
          If you have any questions about this Privacy Policy, please contact us at 
          <a href="mailto:support@example.com" className="text-blue-600 hover:underline"> support@rdretailgroup.com.ph</a>.
        </p>

        <Separator className="my-6" />

        <AlertDialog>
  <AlertDialogTrigger asChild>
    <Button className="w-full mt-4">Agree to Privacy Policy</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Confirm Your Agreement</AlertDialogTitle>
      <AlertDialogDescription>
        By agreeing to this Privacy Policy, you acknowledge that you have read, understood, 
        and accept our practices regarding your personal data. Please ensure you review 
        the policy before proceeding.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Agree</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
      </Card>
    </Container>
  );
};

export default PrivacyPolicy;
