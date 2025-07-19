
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import Link from "next/link";

const includedFeatures = [
  "In-depth analysis of your skin, hair, and eye color",
  "Identification of your unique 12-season color type",
  "A personalized digital color palette",
  "Guidance on your best colors for clothing and accessories",
  "Tips for makeup colors that enhance your natural beauty",
  "A detailed PDF report summarizing your analysis",
];

export default function ColorAnalysisPage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <AnimatedSection className="bg-muted">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            12-Season Color Analysis
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlock your ideal color palette with our signature in-depth analysis. Discover the colors that make you shine and elevate your personal style with confidence.
          </p>
        </div>
      </AnimatedSection>
      
      {/* Main Content */}
      <AnimatedSection className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                src="https://placehold.co/600x400.png"
                alt="Color palettes"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
                data-ai-hint="color palettes"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">What's Included?</h2>
              <p className="mt-2 text-muted-foreground">Our comprehensive analysis provides you with everything you need to embrace your best colors.</p>
              <ul className="mt-6 space-y-4">
                {includedFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-6 w-6 text-primary flex-shrink-0 mr-3 mt-1" />
                    <span className="text-card-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-2xl">Ready to Discover Your Colors?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Begin your journey to a more vibrant you. The process is simple, and the results are transformative.</p>
                    <div className="flex items-baseline gap-4 mt-4">
                       <p className="text-4xl font-bold text-primary">£75</p>
                       <p className="text-muted-foreground">one-time analysis</p>
                    </div>
                    <Button asChild size="lg" className="mt-6 w-full">
                      <Link href="/questionnaire">
                        Start Your Analysis Now <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
