'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Download, Share2, ArrowLeft, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { UserColorPalette } from '@/components/UserColorPalette';
import { getSubmissionById } from '@/services/submissionService';
import { ClientSubmission } from '@/types/submission';

// Sample data - in a real app, this would come from the backend
const samplePalettes = {
  'Spring': {
    name: 'Spring',
    description: 'Warm, clear, and bright colors that reflect the freshness of spring.',
    colors: [
      { name: 'Coral', hex: '#FF7F50' },
      { name: 'Peach', hex: '#FFDAB9' },
      { name: 'Warm Yellow', hex: '#FFD700' },
      { name: 'Apple Green', hex: '#8BC34A' },
      { name: 'Aqua', hex: '#00FFFF' },
      { name: 'Periwinkle', hex: '#CCCCFF' },
    ]
  },
  'Summer': {
    name: 'Summer',
    description: 'Soft, cool, and muted colors with blue undertones.',
    colors: [
      { name: 'Powder Blue', hex: '#B0E0E6' },
      { name: 'Lavender', hex: '#E6E6FA' },
      { name: 'Rose Pink', hex: '#FF9999' },
      { name: 'Sage Green', hex: '#BCB88A' },
      { name: 'Mauve', hex: '#E0B0FF' },
      { name: 'Slate Blue', hex: '#6A5ACD' },
    ]
  },
  'Autumn': {
    name: 'Autumn',
    description: 'Warm, muted, and rich colors inspired by fall foliage.',
    colors: [
      { name: 'Rust', hex: '#B7410E' },
      { name: 'Olive', hex: '#808000' },
      { name: 'Terracotta', hex: '#E2725B' },
      { name: 'Mustard', hex: '#FFDB58' },
      { name: 'Teal', hex: '#008080' },
      { name: 'Burnt Orange', hex: '#CC5500' },
    ]
  },
  'Winter': {
    name: 'Winter',
    description: 'Clear, cool, and intense colors with blue undertones.',
    colors: [
      { name: 'Royal Blue', hex: '#4169E1' },
      { name: 'Emerald', hex: '#50C878' },
      { name: 'Magenta', hex: '#FF00FF' },
      { name: 'Pure White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#000000' },
      { name: 'Ice Blue', hex: '#A5F2F3' },
    ]
  }
};

const clothingRecommendations = {
  'Spring': [
    { name: 'Coral Blouse', image: 'https://via.placeholder.com/300?text=Coral+Blouse' },
    { name: 'Yellow Sundress', image: 'https://via.placeholder.com/300?text=Yellow+Sundress' },
    { name: 'Aqua Cardigan', image: 'https://via.placeholder.com/300?text=Aqua+Cardigan' },
    { name: 'Peach Scarf', image: 'https://via.placeholder.com/300?text=Peach+Scarf' },
  ],
  'Summer': [
    { name: 'Lavender Top', image: 'https://via.placeholder.com/300?text=Lavender+Top' },
    { name: 'Powder Blue Dress', image: 'https://via.placeholder.com/300?text=Powder+Blue+Dress' },
    { name: 'Rose Pink Sweater', image: 'https://via.placeholder.com/300?text=Rose+Pink+Sweater' },
    { name: 'Sage Green Pants', image: 'https://via.placeholder.com/300?text=Sage+Green+Pants' },
  ],
  'Autumn': [
    { name: 'Rust Sweater', image: 'https://via.placeholder.com/300?text=Rust+Sweater' },
    { name: 'Olive Jacket', image: 'https://via.placeholder.com/300?text=Olive+Jacket' },
    { name: 'Terracotta Dress', image: 'https://via.placeholder.com/300?text=Terracotta+Dress' },
    { name: 'Mustard Scarf', image: 'https://via.placeholder.com/300?text=Mustard+Scarf' },
  ],
  'Winter': [
    { name: 'Royal Blue Blazer', image: 'https://via.placeholder.com/300?text=Royal+Blue+Blazer' },
    { name: 'Emerald Dress', image: 'https://via.placeholder.com/300?text=Emerald+Dress' },
    { name: 'Magenta Top', image: 'https://via.placeholder.com/300?text=Magenta+Top' },
    { name: 'Black Pants', image: 'https://via.placeholder.com/300?text=Black+Pants' },
  ]
};

export default function ReportPage() {
  const { id } = useParams();
  const [submission, setSubmission] = useState<ClientSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [season, setSeason] = useState<string>('Winter'); // Default season
  
  useEffect(() => {
    const fetchSubmission = async () => {
      if (id) {
        try {
          setLoading(true);
          const submissionData = await getSubmissionById(id as string);
          setSubmission(submissionData);
          
          // In a real app, you would extract the season from the submission data
          // For now, we'll randomly select one
          const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
          const randomSeason = seasons[Math.floor(Math.random() * seasons.length)];
          setSeason(randomSeason);
        } catch (error) {
          console.error('Error fetching submission:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchSubmission();
  }, [id]);
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Color Analysis',
        text: `Check out my ${season} color palette!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };
  
  if (loading) {
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
        <div className="mb-6">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Your Color Analysis</h1>
              <p className="text-muted-foreground">
                {submission?.createdAt ? new Date(submission.createdAt).toLocaleDateString() : 'Analysis Date'}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Photo</CardTitle>
                <CardDescription>
                  The photo used for your color analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square relative rounded-md overflow-hidden border-4 border-primary/20">
                  <Image
                    src={submission?.photoDataUri || "https://via.placeholder.com/400?text=No+Image"}
                    alt="Analysis Photo"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Your Season</CardTitle>
                <CardDescription>
                  Your color season based on analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className={`text-4xl font-bold mb-2 ${
                  season === 'Spring' ? 'text-yellow-500' :
                  season === 'Summer' ? 'text-blue-400' :
                  season === 'Autumn' ? 'text-orange-600' :
                  'text-blue-700'
                }`}>
                  {season}
                </div>
                <p className="text-muted-foreground">
                  {season === 'Spring' && 'Warm, clear, and bright colors'}
                  {season === 'Summer' && 'Soft, cool, and muted colors'}
                  {season === 'Autumn' && 'Warm, muted, and rich colors'}
                  {season === 'Winter' && 'Clear, cool, and intense colors'}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-8 space-y-6">
            <UserColorPalette 
              season={season} 
              palette={samplePalettes[season as keyof typeof samplePalettes]} 
            />
            
            <Card>
              <CardHeader>
                <CardTitle>Your Color Profile</CardTitle>
                <CardDescription>
                  Understanding your unique color characteristics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="characteristics">
                  <TabsList>
                    <TabsTrigger value="characteristics">Characteristics</TabsTrigger>
                    <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                    <TabsTrigger value="avoid">Colors to Avoid</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="characteristics" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <h3 className="font-medium mb-2">Undertone</h3>
                        <p>
                          {season === 'Spring' || season === 'Autumn' ? 'Warm' : 'Cool'}
                        </p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <h3 className="font-medium mb-2">Contrast</h3>
                        <p>
                          {season === 'Spring' || season === 'Winter' ? 'High' : 'Low'}
                        </p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <h3 className="font-medium mb-2">Intensity</h3>
                        <p>
                          {season === 'Spring' || season === 'Winter' ? 'Bright' : 'Muted'}
                        </p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <h3 className="font-medium mb-2">Value</h3>
                        <p>
                          {season === 'Summer' || season === 'Spring' ? 'Light' : 'Deep'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <h3 className="font-medium mb-2">What This Means</h3>
                      <p>
                        {season === 'Spring' && 'Your coloring is warm and bright. You look best in clear, warm colors with yellow undertones. Avoid colors that are too muted or cool.'}
                        {season === 'Summer' && 'Your coloring is cool and muted. You look best in soft, cool colors with blue undertones. Avoid colors that are too bright or warm.'}
                        {season === 'Autumn' && 'Your coloring is warm and muted. You look best in rich, warm colors with golden undertones. Avoid colors that are too bright or cool.'}
                        {season === 'Winter' && 'Your coloring is cool and bright. You look best in clear, cool colors with blue undertones. Avoid colors that are too muted or warm.'}
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="recommendations" className="mt-4">
                    <p className="mb-4">
                      These colors will enhance your natural coloring and make you look more vibrant and healthy.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {samplePalettes[season as keyof typeof samplePalettes].colors.map((color) => (
                        <div key={color.hex} className="text-center">
                          <div 
                            className="h-20 rounded-md mb-2" 
                            style={{ backgroundColor: color.hex }}
                          />
                          <p className="font-medium">{color.name}</p>
                          <p className="text-xs text-muted-foreground">{color.hex}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="avoid" className="mt-4">
                    <p className="mb-4">
                      These colors may wash you out or create an unflattering contrast with your natural coloring.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* Show colors from opposite season */}
                      {samplePalettes[
                        season === 'Spring' ? 'Autumn' :
                        season === 'Summer' ? 'Winter' :
                        season === 'Autumn' ? 'Spring' :
                        'Summer'
                      as keyof typeof samplePalettes].colors.map((color) => (
                        <div key={color.hex} className="text-center">
                          <div 
                            className="h-20 rounded-md mb-2 relative" 
                            style={{ backgroundColor: color.hex }}
                          >
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-full h-0.5 bg-red-500 rotate-45" />
                              <div className="w-full h-0.5 bg-red-500 -rotate-45" />
                            </div>
                          </div>
                          <p className="font-medium">{color.name}</p>
                          <p className="text-xs text-muted-foreground">{color.hex}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Clothing Recommendations</CardTitle>
                <CardDescription>
                  Suggested items that match your color palette
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {clothingRecommendations[season as keyof typeof clothingRecommendations].map((item, index) => (
                    <div key={index} className="group">
                      <div className="aspect-square relative rounded-md overflow-hidden mb-2">
                        <Image
                          src={item.image}
                          alt={item.name}
                          layout="fill"
                          objectFit="cover"
                          className="group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <p className="font-medium text-sm">{item.name}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Button asChild>
                    <Link href="/shop">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Shop Your Colors
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}