
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StyleQuestionnaire } from '@/components/StyleQuestionnaire';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '@/hooks/useAuth';
import { finalizeSubmissionForPayment, addStripeSessionId, findActiveDraftSubmission, createDraftSubmission, Submission } from '@/services/submissionService';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type QuestionnaireFormData = {
  style: string;
  colors: string[];
};

export default function QuestionnairePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initialData, setInitialData] = useState<Submission | null>(null);
  const { user, loading: isAuthenticating } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticating && !user) {
      router.push('/login?redirect=/questionnaire');
      toast.error("Please log in to start your analysis.");
    }
  }, [user, isAuthenticating, router]);

  useEffect(() => {
      if (user) {
          const initialize = async () => {
              setIsInitializing(true);
              try {
                  const existingDraft = await findActiveDraftSubmission(user.uid);
                  if (existingDraft) {
                      setInitialData(existingDraft);
                      toast.info("Welcome back!", { description: "We've loaded your saved progress." });
                  } else {
                      const newSubmissionId = await createDraftSubmission(user.uid);
                      setInitialData({
                          id: newSubmissionId,
                          userId: user.uid,
                          status: 'draft',
                          questionnaireResponses: '',
                          photoDataUri: '',
                          createdAt: new Date(),
                          lastModified: new Date(),
                      });
                  }
              } catch (error) {
                  toast.error("Error", { description: "Could not initialize your session. Please refresh." });
              } finally {
                  setIsInitializing(false);
              }
          };
          initialize();
      }
  }, [user]);


  const handleQuestionnaireSubmit = async (submissionId: string, formData: QuestionnaireFormData, photoDataUri: string) => {
    setIsLoading(true);
    
    if (!user || !submissionId) {
        toast.error("Authentication Error", { description: "You must be logged in to submit."});
        setIsLoading(false);
        router.push('/login?redirect=/questionnaire');
        return;
    }
    
    try {
      // 1. Finalize the submission data in Firestore and set status to 'pending_payment'.
      const questionnaireResponses = `Style: ${formData.style}\nFavorite Colors: ${formData.colors.join(', ')}`;
      await finalizeSubmissionForPayment(submissionId, questionnaireResponses, photoDataUri);

      // 2. Create a checkout session with the submissionId in metadata.
      const response = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ submissionId }),
      });

      const { sessionId, error: sessionError } = await response.json();

      if (sessionError || !sessionId) {
        throw new Error(sessionError || 'Could not create checkout session.');
      }
      
      // 3. (Optional but good practice) Save Stripe session ID to submission doc
      await addStripeSessionId(submissionId, sessionId);

      // 4. Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          throw new Error(error.message);
        }
      } else {
        throw new Error('Stripe.js has not loaded yet.');
      }

    } catch (error: any) {
        toast.error("Submission Failed", {
            description: error.message || "Something went wrong. Please try again.",
        });
        setIsLoading(false);
    }
  };
  
    if (isAuthenticating || isInitializing) {
        return (
             <div className="flex min-h-screen flex-col bg-muted/40 items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <h2 className="mt-4 text-3xl font-headline">Loading Your Session...</h2>
            </div>
        )
    }

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center text-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <h2 className="mt-4 text-3xl font-headline">Redirecting to Payment...</h2>
            <p className="mt-2 text-muted-foreground max-w-md">
              Please wait while we securely redirect you to our payment processor.
            </p>
          </div>
        ) : (
          user && initialData && <StyleQuestionnaire initialData={initialData} onSubmit={handleQuestionnaireSubmit} />
        )}
      </main>
      <Footer />
    </div>
  );
}
