
'use client';

import { Suspense } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function ConfirmationContent() {
  return (
    <div className="flex-grow flex items-center justify-center text-center">
        <div className="flex flex-col items-center">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <h1 className="text-4xl font-bold">Thank You for Your Purchase!</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-lg">
            Your payment was successful. Our experts will begin your analysis shortly. You will receive an email with your personalized results within 48 hours.
          </p>
          <Button asChild className="mt-8" size="lg">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
    </div>
  );
}


export default function ConfirmationPage() {
    return (
        <div className="flex min-h-screen flex-col bg-muted/40">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex flex-col">
                <Suspense fallback={<div>Loading...</div>}>
                   <ConfirmationContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
