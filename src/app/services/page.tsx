
'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const services = [
    {
        title: "12-Season Color Analysis",
        price: "£75",
        description: "A service to determine an individual's optimal color palette based on their natural coloring.",
        features: ["Personal color season identification", "Comprehensive color palette", "Style guide", "Shopping recommendations"],
        imageUrl: "https://i0.wp.com/www.lesbonsplansdemodange.com/wp-content/uploads/2020/04/cercle-chromatique.jpg?w=500&ssl=1",
        imageHint: "color palette analysis",
        href: "/services/color-analysis"
    },
    {
        title: "Virtual Wardrobe Curation",
        price: "£100",
        description: "A service to help clients organize, optimize, and plan their existing wardrobe virtually.",
        features: ["Wardrobe audit", "Outfit combinations", "Gap analysis", "Shopping list"],
        imageUrl: "https://i.pinimg.com/736x/eb/4b/80/eb4b8075c2fb78868ba8e2b4b5a0f0d0.jpg",
        imageHint: "wardrobe organization",
        href: "/services/wardrobe-curation"
    },
    {
        title: "Personal Shopping Service",
        price: "£150",
        description: "A service providing guided shopping assistance to help clients acquire new clothing and accessories.",
        features: ["Personal shopping session", "Curated selections", "Fitting assistance", "Style coaching"],
        imageUrl: "http://www.charlotteloves.co.uk/wp-content/uploads/2017/03/corporate_styling.jpg",
        imageHint: "personal shopping",
        href: "/services/personal-shopping"
    },
    {
        title: "Style Evolution Coaching",
        price: "£300",
        description: "A comprehensive style transformation program with ongoing support.",
        features: ["Complete style makeover", "3-month support", "Personal styling sessions", "Confidence coaching"],
        imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070",
        imageHint: "style coaching",
        href: "/services/style-coaching"
    },
    {
        title: "Gift Vouchers",
        price: "£75",
        description: "Give the gift of confidence and style with our flexible gift vouchers.",
        features: ["Flexible redemption", "12-month validity", "Personal message", "Digital delivery"],
        imageUrl: "https://placehold.co/600x400.png",
        imageHint: "gift voucher",
        href: "/services/gift-vouchers"
    }
];


export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50">
            <Header />
            <div className="pt-32 pb-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-bold mb-6 text-gray-900">Our Services</h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">Professional styling services designed to enhance your natural beauty and boost your confidence.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div key={index} className="group bg-white/50 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg border border-white/30 hover:shadow-2xl transition-all duration-300 flex flex-col">
                                <div className="relative overflow-hidden">
                                    <Link href={service.href}>
                                      <Image 
                                        src={service.imageUrl} 
                                        alt={service.title} 
                                        width={400}
                                        height={300}
                                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                                        data-ai-hint={service.imageHint}
                                        />
                                    </Link>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                                    <div className="absolute top-4 right-4">
                                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                                            <span className="text-lg font-bold text-purple-700">{service.price}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="text-center mb-6">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                                        <p className="text-gray-600 mb-6 flex-grow">{service.description}</p>
                                    </div>
                                    <ul className="space-y-3 mb-8">
                                        {service.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center text-gray-700">
                                                <Check className="w-5 h-5 text-green-500 mr-3" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-auto">
                                        <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200">
                                            <Link href="/questionnaire">
                                                Take the Quiz
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
