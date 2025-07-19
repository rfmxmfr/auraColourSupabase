
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight, Gift } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import Link from "next/link";

const includedFeatures = [
  "Redeemable against any of our styling services",
  "The perfect gift for birthdays, holidays, or any special occasion",
  "Delivered instantly via email with a personal message",
  "Valid for 12 months from the date of purchase",
  "Available in various denominations",
];

export default function GiftVouchersPage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <AnimatedSection className="bg-muted">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Gift Vouchers
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Give the gift of style and confidence. Our gift vouchers are the perfect present for anyone looking to discover their personal style.
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
                alt="Gift voucher presentation"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
                data-ai-hint="gift card"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">The Perfect Gift</h2>
              <p className="mt-2 text-muted-foreground">Our gift vouchers are flexible and easy to use.</p>
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
                    <CardTitle className="text-2xl">Purchase a Gift Voucher</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Choose an amount and send a personalized gift in minutes.</p>
                     <div className="flex items-baseline gap-4 mt-4">
                       <p className="text-4xl font-bold text-primary">From £75</p>
                    </div>
                    <Button asChild size="lg" className="mt-6 w-full">
                      <Link href="/contact">
                        Buy Gift Voucher <Gift className="ml-2 h-5 w-5" />
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
