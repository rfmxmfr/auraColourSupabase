
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AccountCreationOption from './AccountCreationOption';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const [showAccountOption, setShowAccountOption] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [email, setEmail] = useState<string | undefined>();
  const [submissionId, setSubmissionId] = useState<string | undefined>();
  
  useEffect(() => {
    // Check if this was an anonymous submission
    const anonymous = searchParams.get('anonymous') === 'true';
    const emailParam = searchParams.get('email') || undefined;
    const subId = searchParams.get('submission_id') || undefined;
    
    setIsAnonymous(anonymous);
    setEmail(emailParam);
    setSubmissionId(subId);
    setShowAccountOption(anonymous);
  }, [searchParams]);
  
  if (showAccountOption && isAnonymous && submissionId) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold">Thank You for Your Purchase!</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-lg">
            Your payment was successful. Our experts will begin your analysis shortly.
          </p>
        </div>
        
        <div className="w-full max-w-md">
          <AccountCreationOption email={email} submissionId={submissionId} />
        </div>
      </div>
    );
  }
  
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
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-accent/20">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex flex-col">
                <Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
                   <ConfirmationContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
