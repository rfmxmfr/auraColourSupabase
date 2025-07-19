
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import Link from "next/link";

const includedFeatures = [
  "Ongoing 1-on-1 sessions with a dedicated personal stylist",
  "Development of your unique style identity",
  "Seasonal wardrobe planning and updates",
  "Confidence-building exercises and style challenges",
  "Unlimited text/email support for style advice",
  "Personalized feedback on your outfits",
];

export default function StyleCoachingPage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <AnimatedSection className="bg-muted">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Style Evolution Coaching
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Ongoing guidance to refine your style and build lasting confidence. This is a journey of transformation to become the most stylish version of yourself.
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
                alt="Stylish person looking confident"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
                data-ai-hint="confident style"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">What's Included?</h2>
              <p className="mt-2 text-muted-foreground">Our coaching program is a partnership for your style journey.</p>
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
                    <CardTitle className="text-2xl">Ready for a Style Evolution?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">This is more than just clothes; it's about discovering your identity and confidence.</p>
                     <div className="flex items-baseline gap-4 mt-4">
                       <p className="text-4xl font-bold text-primary">£300</p>
                       <p className="text-muted-foreground">for 3 months</p>
                    </div>
                    <Button asChild size="lg" className="mt-6 w-full">
                      <Link href="/contact">
                        Inquire About Coaching <ArrowRight className="ml-2 h-5 w-5" />
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
