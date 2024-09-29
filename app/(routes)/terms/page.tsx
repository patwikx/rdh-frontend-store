import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const TermsOfService = () => {
  return (
    <Container>
      <Card className="p-8 md:p-10 space-y-6 bg-gray-50 shadow-lg rounded-lg mt-4">
        <h1 className="text-4xl font-extrabold text-center">Terms of Service</h1>
        <p className="text-lg text-center text-gray-700">
          Welcome to our Terms of Service. By accessing or using our services, you agree to these terms.
        </p>

        <Separator className="my-6" />

        <h2 className="text-3xl font-semibold">1. Acceptance of Terms</h2>
        <p className="text-gray-600">
          By accessing or using our service, you agree to comply with and be bound by these terms and conditions.
          If you do not agree to these terms, you may not access or use the service.
        </p>

        <Separator className="my-4" />

        <h2 className="text-3xl font-semibold">2. Changes to Terms</h2>
        <p className="text-gray-600">
          We reserve the right to modify these terms at any time. Changes will be effective when posted on our website.
          Your continued use of the service after any changes indicates your acceptance of the new terms.
        </p>

        <Separator className="my-4" />

        <h2 className="text-3xl font-semibold">3. User Responsibilities</h2>
        <p className="text-gray-600">
          You are responsible for maintaining the confidentiality of your account and password. 
          You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
        </p>
        <p className="text-gray-600">
          You agree not to use the service for any unlawful purpose or in a way that violates any applicable laws.
        </p>

        <Separator className="my-4" />

        <h2 className="text-3xl font-semibold">4. Limitation of Liability</h2>
        <p className="text-gray-600">
          Our liability is limited to the maximum extent permitted by law. 
          We are not liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service.
        </p>

        <Separator className="my-4" />

        <h2 className="text-3xl font-semibold">5. Intellectual Property</h2>
        <p className="text-gray-600">
          All content, trademarks, and other intellectual property displayed on our service are the property of 
          [Your Company Name] or third parties. You may not reproduce, distribute, or create derivative works 
          from any content without our prior written consent.
        </p>

        <Separator className="my-4" />

        <h2 className="text-3xl font-semibold">6. Termination</h2>
        <p className="text-gray-600">
          We reserve the right to terminate or suspend your access to our service at our discretion, without notice,
          for conduct that we believe violates these terms or is harmful to other users or us.
        </p>

        <Separator className="my-4" />

        <h2 className="text-3xl font-semibold">7. Governing Law</h2>
        <p className="text-gray-600">
          These terms will be governed by and construed in accordance with the laws of [Your State/Country], 
          without regard to its conflict of law principles.
        </p>

        <Separator className="my-4" />

        <h2 className="text-3xl font-semibold">8. Contact Us</h2>
        <p className="text-gray-600">
          If you have any questions about these terms, please contact us at 
          <a href="mailto:support@example.com" className="text-blue-600 hover:underline"> support@rdretailgroup.com.ph</a>.
        </p>

        <Separator className="my-6" />

        <AlertDialog>
  <AlertDialogTrigger asChild>
    <Button className="w-full mt-4">Agree to Terms</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Confirm Your Agreement</AlertDialogTitle>
      <AlertDialogDescription>
        By agreeing to these Terms of Service, you acknowledge that you have read, understood, 
        and accept all terms and conditions. Please ensure you review the terms before proceeding.
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

export default TermsOfService;
