
'use client';

import { Shield, Star, Award, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface TrustSignal {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Testimonial {
  quote: string;
  author: string;
  season: string;
  imageUrl: string;
}

const defaultSignals: TrustSignal[] = [
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: 'Secure Payments',
    description: 'Your payment information is encrypted and processed securely by Stripe.',
  },
  {
    icon: <Award className="h-8 w-8 text-primary" />,
    title: 'Expert Analysis',
    description: 'Our color analysts are certified and trained in the 12-season system.',
  },
  {
    icon: <Star className="h-8 w-8 text-primary" />,
    title: 'Satisfaction Guaranteed',
    description: 'We offer a satisfaction guarantee to ensure you love your results.',
  },
  {
    icon: <Heart className="h-8 w-8 text-primary" />,
    title: 'Loved by Clients',
    description: 'Join thousands of happy clients who have discovered their perfect colors.',
  },
];

const testimonials: Testimonial[] = [
    {
        quote: "This was a game-changer! I finally understand which colors make me look and feel my best. My wardrobe has never been so cohesive.",
        author: "Sarah J.",
        season: "True Summer",
        imageUrl: "https://placehold.co/100x100.png"
    },
    {
        quote: "I was always guessing with my clothes. Aura Colours gave me the confidence to shop and dress with purpose. Highly recommend!",
        author: "Michael B.",
        season: "Deep Autumn",
        imageUrl: "https://placehold.co/100x100.png"
    }
]

export function TrustSignals() {
  return (
    <section className="py-16 md:py-24 bg-muted/40">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold md:text-4xl">Why Choose Aura Colours?</h2>
                <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">We are dedicated to providing a professional and transformative experience.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {defaultSignals.map((signal) => (
                    <div key={signal.title} className="text-center">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-background mb-4 mx-auto shadow-md">
                            {signal.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{signal.title}</h3>
                        <p className="text-muted-foreground">{signal.description}</p>
                    </div>
                ))}
            </div>

             <div className="grid md:grid-cols-2 gap-8">
                {testimonials.map(testimonial => (
                    <Card key={testimonial.author} className="bg-card">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <Image 
                                    src={testimonial.imageUrl}
                                    alt={testimonial.author}
                                    width={64}
                                    height={64}
                                    className="rounded-full"
                                    data-ai-hint="portrait"
                                />
                                <div>
                                    <CardTitle>{testimonial.author}</CardTitle>
                                    <p className="text-sm text-primary font-semibold">{testimonial.season}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    </section>
  )
}
