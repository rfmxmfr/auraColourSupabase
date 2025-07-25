
'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { signInWithEmail } from '@/services/clientAuthService';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [redirectPath, setRedirectPath] = useState('/admin/dashboard');
  
  useEffect(() => {
    const redirect = searchParams.get('redirect');
    if (redirect) {
      setRedirectPath(redirect);
    }
  }, [searchParams]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const result = await signInWithEmail(values.email, values.password);
      
      if (result.success) {
        toast.success('Login successful!');
        setIsRedirecting(true);
        
        // Force immediate navigation with direct window location
        window.location.href = redirectPath;
      } else {
        setIsLoading(false);
        toast.error('Login Failed', {
          description: result.error,
        });
      }
    } catch (error) {
      setIsLoading(false);
      toast.error('Login Error', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading || isRedirecting}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : isRedirecting ? 'Redirecting...' : 'Login'}
                </Button>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
                Don't have an account?{' '}
                <Link href="/signup" className="underline">
                    Sign up
                </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col bg-muted/40">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex items-center justify-center">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Loading...</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
