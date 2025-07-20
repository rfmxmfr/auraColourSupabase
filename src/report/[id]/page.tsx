
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Loader2, Palette, Shirt, BookOpen, Check, Sparkles, AlertTriangle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Define the structure of the report data
interface ReportData {
  colorAnalysis: {
    colorPalette: string;
    stylingTips: string;
  };
  styleReport: {
    report: string;
    recommendations: {
      item: string;
      description: string;
      color: string;
    }[];
  };
}

export default function ReportPage({ params }: { params: { id: string } }) {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      const fetchReport = async () => {
        try {
          const { data, error } = await supabase
            .from('submissions')
            .select('*')
            .eq('id', params.id)
            .single();

          if (error) throw error;

          if (data) {
            if(data.status === 'completed') {
              setReport({
                colorAnalysis: data.color_analysis,
                styleReport: data.style_report,
              });
            } else {
              setError("Your report is still being generated. Please check back in a few minutes.");
            }
          } else {
            setError('No such report found! Please check the link and try again.');
          }
        } catch (err) {
          console.error(err);
          setError('Failed to fetch the report. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchReport();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <h2 className="mt-6 text-2xl font-bold">Generating Your Report...</h2>
          <p className="mt-2 text-muted-foreground">Our experts are putting the final touches on your analysis.</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <div className="bg-destructive/10 border border-destructive/20 p-8 rounded-lg">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-destructive mb-4">An Error Occurred</h2>
            <p className="text-muted-foreground max-w-md">{error}</p>
             <Button asChild className="mt-6">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <Header />
      <main className="container mx-auto py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white mb-4 shadow-lg">
                <Check className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Your Personalized Style Report</h1>
            <p className="text-lg text-muted-foreground">Congratulations! Here is your complete color and style analysis.</p>
          </div>

          {report && (
            <div className="space-y-8">
              <Card className="shadow-lg">
                  <CardHeader>
                      <CardTitle className="text-2xl flex items-center gap-3">
                          <BookOpen className="w-7 h-7 text-primary" />
                          Style Report Summary
                      </CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{report.styleReport.report}</p>
                  </CardContent>
              </Card>

              <Accordion type="single" collapsible defaultValue="item-1" className="w-full space-y-8">
                <AccordionItem value="item-1" className="border-b-0">
                   <Card className="shadow-lg">
                     <AccordionTrigger className="text-xl font-semibold p-6 hover:no-underline">
                        <div className="flex items-center gap-3">
                          <Palette className="w-7 h-7 text-primary" />
                          Color Analysis
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-6 pt-0">
                          <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Your Color Palette: <span className="text-primary">{report.colorAnalysis.colorPalette}</span></h3>
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <p className="font-semibold">Styling Tips</p>
                                    <p className="text-muted-foreground whitespace-pre-line mt-2 leading-relaxed">{report.colorAnalysis.stylingTips}</p>
                                </div>
                            </div>
                          </div>
                      </AccordionContent>
                   </Card>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-b-0">
                  <Card className="shadow-lg">
                    <AccordionTrigger className="text-xl font-semibold p-6 hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Shirt className="w-7 h-7 text-primary" />
                        Clothing Recommendations
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-0">
                      <div className="grid md:grid-cols-2 gap-6">
                        {report.styleReport.recommendations.map((rec, index) => (
                          <Card key={index} className="bg-muted/50">
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-yellow-500" />
                                {rec.item}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{rec.description}</p>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full border-2 border-white shadow-md" style={{ backgroundColor: rec.color }}></div>
                                <span className="font-semibold text-sm">{rec.color}</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              </Accordion>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
