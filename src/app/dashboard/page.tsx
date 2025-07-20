'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Palette, ShoppingBag, Calendar, FileText, User, Settings, LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ClientSubmission } from '@/types/submission';
import { getUserSubmissions } from '@/services/submissionService';

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [submissions, setSubmissions] = useState<ClientSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (user) {
        try {
          setLoading(true);
          const userSubmissions = await getUserSubmissions(user.uid);
          setSubmissions(userSubmissions);
        } catch (error) {
          console.error('Error fetching submissions:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (user) {
      fetchSubmissions();
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto relative w-24 h-24 rounded-full overflow-hidden mb-2 border-4 border-primary/20">
                    <Image 
                      src={user.photoURL || "https://i.pravatar.cc/300"} 
                      alt="Profile" 
                      layout="fill" 
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                  <CardTitle>{user.displayName || 'User'}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Palette className="mr-2 h-4 w-4" />
                      Color Analysis
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Shop Recommendations
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      Appointments
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                  </nav>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">My Dashboard</h1>
              <Button asChild>
                <Link href="/questionnaire">New Analysis</Link>
              </Button>
            </div>
            
            <Tabs defaultValue="analysis">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="analysis">Color Analysis</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="analysis" className="space-y-6 mt-6">
                {loading ? (
                  <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : submissions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {submissions
                      .filter(sub => sub.status === 'completed')
                      .map(submission => (
                        <Card key={submission.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="aspect-video relative">
                            <Image
                              src={submission.photoDataUri || "https://via.placeholder.com/400x200?text=No+Image"}
                              alt="Analysis"
                              layout="fill"
                              objectFit="cover"
                            />
                          </div>
                          <CardHeader>
                            <CardTitle>Color Analysis</CardTitle>
                            <CardDescription>
                              {new Date(submission.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Your personalized color analysis is ready to view.
                            </p>
                          </CardContent>
                          <CardFooter>
                            <Button asChild className="w-full">
                              <Link href={`/report/${submission.id}`}>
                                <FileText className="mr-2 h-4 w-4" />
                                View Report
                              </Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>No Analysis Yet</CardTitle>
                      <CardDescription>
                        You haven't completed a color analysis yet.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Start your color journey by completing our questionnaire.</p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild>
                        <Link href="/questionnaire">Start Analysis</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="recommendations" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Style Recommendations</CardTitle>
                    <CardDescription>
                      Personalized clothing and accessory suggestions based on your color analysis.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {submissions.some(sub => sub.status === 'completed') ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                          <div key={item} className="rounded-lg overflow-hidden border group">
                            <div className="aspect-square relative bg-muted">
                              <Image
                                src={`https://via.placeholder.com/300?text=Item+${item}`}
                                alt={`Recommendation ${item}`}
                                layout="fill"
                                objectFit="cover"
                                className="group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="p-3">
                              <h4 className="font-medium">Item {item}</h4>
                              <p className="text-sm text-muted-foreground">Perfect for your palette</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          Complete a color analysis to get personalized recommendations.
                        </p>
                        <Button asChild className="mt-4">
                          <Link href="/questionnaire">Start Analysis</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Submission History</CardTitle>
                    <CardDescription>
                      All your previous color analysis submissions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex justify-center p-6">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : submissions.length > 0 ? (
                      <div className="space-y-4">
                        {submissions.map(submission => (
                          <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-md overflow-hidden relative bg-muted flex-shrink-0">
                                {submission.photoDataUri ? (
                                  <Image
                                    src={submission.photoDataUri}
                                    alt="Submission"
                                    layout="fill"
                                    objectFit="cover"
                                  />
                                ) : (
                                  <Palette className="h-6 w-6 m-auto text-muted-foreground" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">Submission #{submission.id.substring(0, 6)}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(submission.createdAt).toLocaleDateString()} • 
                                  <span className="ml-1 capitalize">{submission.status}</span>
                                </p>
                              </div>
                            </div>
                            {submission.status === 'completed' && (
                              <Button asChild size="sm" variant="outline">
                                <Link href={`/report/${submission.id}`}>View</Link>
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-6 text-muted-foreground">No submissions found.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}