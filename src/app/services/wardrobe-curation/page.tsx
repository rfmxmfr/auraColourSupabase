
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import Link from "next/link";

const includedFeatures = [
  "A full audit of your current wardrobe",
  "Personalized style roadmap and mood board",
  "A curated list of 20-25 key items to build your new wardrobe",
  "Outfit formulas to easily create stylish looks",
  "Guidance on how to shop smart and avoid impulse buys",
  "A digital lookbook of outfits for different occasions",
];

export default function WardrobeCurationPage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <AnimatedSection className="bg-muted">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Virtual Wardrobe Curation
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Let us help you build a stylish, cohesive wardrobe that you'll love to wear. We'll refine your style and make getting dressed the easiest part of your day.
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
                alt="Organized closet"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
                data-ai-hint="organized closet"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">What's Included?</h2>
              <p className="mt-2 text-muted-foreground">Our curation service is designed to give you a functional and fashionable wardrobe.</p>
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
                    <CardTitle className="text-2xl">Ready for a Wardrobe Refresh?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Transform your closet into a source of inspiration. It's time to love your clothes again.</p>
                     <div className="flex items-baseline gap-4 mt-4">
                       <p className="text-4xl font-bold text-primary">£100</p>
                       <p className="text-muted-foreground">per curation</p>
                    </div>
                    <Button asChild size="lg" className="mt-6 w-full">
                      <Link href="/book">
                        Book Your Curation <ArrowRight className="ml-2 h-5 w-5" />
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
