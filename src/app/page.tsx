
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ColorPalette } from "@/components/ColorPalette";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Parallax } from "@/components/Parallax";
import { ArrowRight, Camera, Check, ChevronRight, Mail, Paintbrush, Palette, ShoppingBag, Sparkles, User } from "lucide-react";
import { TrustSignals } from "@/components/TrustSignals";

const howItWorksSteps = [
    {
      icon: <Check className="w-8 h-8 text-white" />,
      step: "01",
      title: "Complete Style Questionnaire",
      description: "Answer a few targeted questions about your preferences, lifestyle, and color goals to personalize your analysis."
    },
    {
      icon: <Camera className="w-8 h-8 text-white" />,
      step: "02",
      title: "Upload Professional Photos",
      description: "Submit three specific photos: full face with hair pulled back, full face with hair down, and wrist showing vein colors for accurate undertone analysis."
    },
    {
      icon: <Paintbrush className="w-8 h-8 text-white" />,
      step: "03",
      title: "Professional Analysis",
      description: "Our certified color analysts review your photos and questionnaire to determine your seasonal color palette using the 12-season system."
    },
    {
      icon: <Mail className="w-8 h-8 text-white" />,
      step: "04",
      title: "Receive Detailed Results",
      description: "Get your comprehensive color analysis report delivered to your email within 48 hours, including your seasonal palette, styling guide, and shopping recommendations."
    }
];

const services = [
  {
    icon: <Palette className="h-6 w-6 text-white" />,
    title: "12-Season Color Analysis",
    description: "A service to determine an individual's optimal color palette based on their natural coloring.",
    price: "£75",
    href: "/services/color-analysis",
    imageUrl: "https://i0.wp.com/www.lesbonsplansdemodange.com/wp-content/uploads/2020/04/cercle-chromatique.jpg?w=500&ssl=1",
    imageHint: "color palette analysis",
    features: ["Personal color season identification", "Comprehensive color palette", "Style guide", "Shopping recommendations"],
  },
  {
    icon: <ShoppingBag className="h-6 w-6 text-white" />,
    title: "Virtual Wardrobe Curation",
    description: "A service to help clients organize, optimize, and plan their existing wardrobe virtually.",
    price: "£100",
    href: "/services/wardrobe-curation",
    imageUrl: "https://i.pinimg.com/736x/eb/4b/80/eb4b8075c2fb78868ba8e2b4b5a0f0d0.jpg",
    imageHint: "wardrobe organization",
    features: ["Wardrobe audit", "Outfit combinations", "Gap analysis", "Shopping list"],
  },
  {
    icon: <User className="h-6 w-6 text-white" />,
    title: "Personal Shopping Service",
    description: "A service providing guided shopping assistance to help clients acquire new clothing and accessories.",
    price: "£150",
    href: "/services/personal-shopping",
    imageUrl: "http://www.charlotteloves.co.uk/wp-content/uploads/2017/03/corporate_styling.jpg",
    imageHint: "personal shopping",
    features: ["Personal shopping session", "Curated selections", "Fitting assistance", "Style coaching"],
  },
  {
    icon: <Sparkles className="h-6 w-6 text-white" />,
    title: "Style Evolution Coaching",
    description: "A comprehensive style transformation program with ongoing support.",
    price: "£300",
    href: "/services/style-coaching",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070",
    imageHint: "style coaching",
    features: ["Complete style makeover", "3-month support", "Personal styling sessions", "Confidence coaching"],
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-muted pt-32 pb-20 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <AnimatedSection delay={0.1} className="space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full border border-primary/10 shadow-sm">
                                <div className="w-2 h-2 bg-gradient-to-r from-primary to-pink-400 rounded-full animate-pulse" />
                                <span className="text-sm font-medium text-muted-foreground">Human Powered Color Analysis</span>
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tighter">
                                Discover Your
                                <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                                Perfect Colors
                                </span>
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                                Discover the colors that make you look effortlessly radiant with our professional color analysis.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200">
                              <Link href="/questionnaire">
                                Start Your Analysis
                                <ArrowRight className="ml-2 w-5 h-5" />
                              </Link>
                            </Button>
                             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-green-600" />
                                </div>
                                <span>Professional Analysis</span>
                            </div>
                        </div>
                    </AnimatedSection>
                     <AnimatedSection delay={0.3} className="relative">
                        <Parallax offset={50}>
                           <ColorPalette />
                        </Parallax>
                    </AnimatedSection>
                </div>
            </div>
        </section>

        {/* How It Works Section */}
        <AnimatedSection id="how-it-works" className="py-16 md:py-24 bg-gradient-to-b from-white to-purple-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold md:text-4xl">How It Works</h2>
              <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">A simple, four-step process to unlock your personalized color palette and style.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorksSteps.map((step, i) => (
                <AnimatedSection key={step.step} delay={i * 0.1}>
                  <div className="text-center group">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-200">
                        {step.icon}
                      </div>
                      <div className="text-sm font-bold text-primary bg-primary/10 rounded-full px-3 py-1 inline-block">
                        Step {step.step}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
             <div className="text-center mt-12">
                <Button asChild size="lg">
                    <Link href="/questionnaire">
                        Start Your Analysis
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </Button>
            </div>
          </div>
        </AnimatedSection>

        {/* Services Section */}
        <AnimatedSection id="services" className="bg-muted py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold md:text-4xl">
                Our Services
              </h2>
              <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
                Tailored solutions to help you discover and embrace your unique style.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {services.map((service, i) => (
                <AnimatedSection key={service.title} delay={i * 0.1}>
                  <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col hover:-translate-y-2">
                    <div className="relative overflow-hidden">
                      <Image 
                        src={service.imageUrl} 
                        alt={service.title} 
                        width={400} 
                        height={300} 
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        data-ai-hint={service.imageHint}
                      />
                       <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                              {service.icon}
                          </div>
                       </div>
                    </div>
                    <div className="p-6 pt-10 text-center flex flex-col flex-grow">
                      <div className="mb-2">
                          <span className="text-2xl font-bold text-purple-600">{service.price}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-900">{service.title}</h3>
                      <p className="text-gray-600 mb-6 text-sm leading-relaxed flex-grow">{service.description}</p>
                     
                      <div className="space-y-3 mt-auto">
                          <Link href={service.href} className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold text-sm transition-colors duration-200">
                            Learn More
                            <ChevronRight className="ml-1 w-4 h-4" />
                          </Link>
                          <div className="flex gap-2">
                              <Button asChild className="flex-1 text-sm">
                                  <Link href="/questionnaire">Book Service</Link>
                              </Button>
                               <Button asChild variant="outline" className="flex-1 text-sm">
                                  <Link href="/questionnaire">Take Quiz</Link>
                              </Button>
                          </div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
             <div className="text-center mt-12">
                <Button asChild size="lg" variant="outline">
                    <Link href="/services">
                        View All Services
                        <ChevronRight className="ml-2 w-5 h-5" />
                    </Link>
                </Button>
            </div>
          </div>
        </AnimatedSection>

        <TrustSignals />

      </main>

      <Footer />
    </div>
  );
}
