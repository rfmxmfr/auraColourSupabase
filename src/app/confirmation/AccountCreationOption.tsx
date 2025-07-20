'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AccountCreationOption({ email, submissionId }: { email?: string, submissionId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState(email || '');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleCreateAccount = async () => {
    if (!userEmail || !password) {
      toast.error('Please provide both email and password');
      return;
    }

    setIsLoading(true);
    try {
      // Create the user account
      const { data, error } = await supabase.auth.signUp({
        email: userEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            submission_id: submissionId
          }
        }
      });

      if (error) {
        throw error;
      }

      // Link the submission to the new user
      if (data.user) {
        await supabase
          .from('submissions')
          .update({ 
            user_id: data.user.id,
            metadata: { 
              linked_to_account: true,
              original_submission_id: submissionId
            }
          })
          .eq('id', submissionId);
      }

      toast.success('Account created!', { 
        description: 'Please check your email to verify your account.' 
      });
      
      // Redirect to the dashboard or results page
      router.push('/results');
    } catch (error: any) {
      toast.error('Account creation failed', { 
        description: error.message || 'Something went wrong. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    toast.info('You can create an account later', { 
      description: 'Your results will be sent to your email if provided.' 
    });
    router.push('/');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>
          Create an account to access your results anytime and get personalized recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="your.email@example.com" 
            value={userEmail} 
            onChange={(e) => setUserEmail(e.target.value)} 
            disabled={!!email}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            placeholder="Create a secure password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleSkip}>
          Skip for Now
        </Button>
        <Button onClick={handleCreateAccount} disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Account'}
        </Button>
      </CardFooter>
    </Card>
  );
}