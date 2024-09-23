'use client'

import Link from 'next/link';
import { UserAuthForm } from './components/auth-form';
import { Card, CardContent } from '@/components/ui/card';


export default function Login() {

  return (
    <>
      <Card className='max-w-md mx-auto mt-16 mb-60'>
        <CardContent className='p-8'>
          <div className="space-y-6 text-center">
            <div className="flex flex-col space-y-2">
            
              <h1 className="text-2xl font-bold tracking-tight"> 
                RD Hardware & Fishing Supply, Inc.
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email and password to login.
              </p>
            </div>
            <UserAuthForm />
            <p className="text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
