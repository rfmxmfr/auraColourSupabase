
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import Link from "next/link";

const includedFeatures = [
  "A pre-shopping consultation to define your needs and budget",
  "Personalized shopping list tailored to your style goals",
  "Expert guidance from a personal stylist during the shopping session (virtual or in-person)",
  "Access to exclusive stylist discounts at select retailers",
  "Integration of new pieces with your existing wardrobe",
  "A follow-up session to style your new items",
];

export default function PersonalShoppingPage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <AnimatedSection className="bg-muted">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Personal Shopping Service
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            We find the perfect pieces to elevate your style, saving you time and effort. Enjoy a stress-free shopping experience with expert guidance.
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
                alt="Person shopping"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
                data-ai-hint="personal shopping"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">What's Included?</h2>
              <p className="mt-2 text-muted-foreground">Our personal shopping service is your shortcut to a perfect wardrobe.</p>
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
                    <CardTitle className="text-2xl">Ready to Shop with an Expert?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Let's find the clothes that truly represent you. Effortless style is just a session away.</p>
                     <div className="flex items-baseline gap-4 mt-4">
                       <p className="text-4xl font-bold text-primary">£150</p>
                       <p className="text-muted-foreground">per session</p>
                    </div>
                    <Button asChild size="lg" className="mt-6 w-full">
                      <Link href="/book">
                        Book a Shopping Session <ArrowRight className="ml-2 h-5 w-5" />
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
