
'use client';

import { useState, useEffect } from 'react';
import './questionnaire.css';
import { useRouter } from 'next/navigation';
import { EnhancedQuestionnaire } from '@/components/EnhancedQuestionnaire';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '@/hooks/useAuth';
import { finalizeSubmissionForPayment, addStripeSessionId, findActiveDraftSubmission, createDraftSubmission } from '@/services/submissionService';
import { ClientSubmission, mapServerToClientSubmission } from '@/types/submission';
import { finalizeAnonymousSubmission, createAnonymousSubmission } from '@/services/anonymousSubmissionService';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type QuestionnaireFormData = {
  style: string;
  colors: string[];
};

export default function QuestionnairePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initialData, setInitialData] = useState<ClientSubmission | null>(null);
  const { user, loading: isAuthenticating } = useAuth();
  const router = useRouter();

  // No longer requiring login to start the questionnaire

  useEffect(() => {
      const initialize = async () => {
          setIsInitializing(true);
          try {
              if (user) {
                  // For logged-in users, try to find existing draft
                  const existingDraft = await findActiveDraftSubmission(user.uid);
                  if (existingDraft) {
                      setInitialData(mapServerToClientSubmission(existingDraft));
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
              } else {
                  // For anonymous users, create a submission in the database
                  const newSubmissionId = await createAnonymousSubmission();
                  setInitialData({
                      id: newSubmissionId,
                      userId: 'anonymous',
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
  }, [user]);


  const handleQuestionnaireSubmit = async (submissionId: string, formData: QuestionnaireFormData, photoDataUri: string, email?: string) => {
    setIsLoading(true);
    
    try {
      // Prepare the questionnaire responses
      const questionnaireResponses = JSON.stringify({
        style: formData.style,
        colors: formData.colors
      });
      
      // Handle different user states
      let finalSubmissionId = submissionId;
      
      if (user) {
        // User is already logged in, proceed normally
        await finalizeSubmissionForPayment(submissionId, questionnaireResponses, photoDataUri);
      } else {
        // Anonymous user - use the anonymous submission service
        await finalizeAnonymousSubmission(submissionId, questionnaireResponses, photoDataUri, email);
      }

      // Create a checkout session with the submissionId in metadata
      const response = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          submissionId: finalSubmissionId,
          email: email || undefined,
          isAnonymous: !user
        }),
      });

      const { sessionId, error: sessionError } = await response.json();

      if (sessionError || !sessionId) {
        throw new Error(sessionError || 'Could not create checkout session.');
      }
      
      // Save Stripe session ID to submission doc
      await addStripeSessionId(finalSubmissionId, sessionId);

      // Redirect to Stripe Checkout
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
             <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-accent/20 items-center justify-center">
                <div className="bg-white/80 backdrop-blur-sm p-10 rounded-xl shadow-lg">
                    <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
                    <h2 className="mt-6 text-3xl font-bold text-center">Loading Your Session...</h2>
                </div>
            </div>
        )
    }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-accent/20">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center text-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <h2 className="mt-4 text-3xl font-bold">Redirecting to Payment...</h2>
            <p className="mt-2 text-muted-foreground max-w-md">
              Please wait while we securely redirect you to our payment processor.
            </p>
          </div>
        ) : (
          user && initialData && <EnhancedQuestionnaire initialData={initialData} onSubmit={handleQuestionnaireSubmit} />
        )}
      </main>
      <Footer />
    </div>
  );
}
