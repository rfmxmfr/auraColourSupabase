'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColorSwatch {
  name: string;
  hex: string;
}

interface SeasonPalette {
  name: string;
  description: string;
  colors: ColorSwatch[];
}

interface UserColorPaletteProps {
  season: string;
  palette: SeasonPalette;
  className?: string;
}

export function UserColorPalette({ season, palette, className }: UserColorPaletteProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  
  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };
  
  const handleDownloadPalette = () => {
    // Create a canvas to draw the palette
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const width = 800;
    const height = 400;
    const colorCount = palette.colors.length;
    const colorWidth = width / colorCount;
    
    canvas.width = width;
    canvas.height = height;
    
    if (ctx) {
      // Draw title
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`${season} Color Palette`, 20, 40);
      
      // Draw colors
      palette.colors.forEach((color, index) => {
        ctx.fillStyle = color.hex;
        ctx.fillRect(index * colorWidth, 60, colorWidth, height - 120);
        
        // Draw color name
        ctx.fillStyle = '#000000';
        ctx.font = '14px Arial';
        ctx.fillText(color.name, index * colorWidth + 10, height - 30);
        ctx.fillText(color.hex, index * colorWidth + 10, height - 10);
      });
      
      // Convert to image and download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${season.toLowerCase().replace(' ', '-')}-palette.png`;
      link.href = dataUrl;
      link.click();
    }
  };
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className={cn("bg-gradient-to-r", 
        season.includes("Spring") ? "from-green-600 to-yellow-500" : 
        season.includes("Summer") ? "from-blue-500 to-purple-400" : 
        season.includes("Autumn") ? "from-orange-600 to-amber-500" : 
        "from-blue-700 to-indigo-600", // Winter
        "text-white"
      )}>
        <CardTitle>{season}</CardTitle>
        <CardDescription className="text-white/90">{palette.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="palette">
          <TabsList className="mb-4">
            <TabsTrigger value="palette">Color Palette</TabsTrigger>
            <TabsTrigger value="swatches">Individual Colors</TabsTrigger>
          </TabsList>
          
          <TabsContent value="palette" className="space-y-4">
            <div className="flex h-24 rounded-md overflow-hidden">
              {palette.colors.map((color) => (
                <div 
                  key={color.hex} 
                  className="flex-1" 
                  style={{ backgroundColor: color.hex }}
                  title={`${color.name}: ${color.hex}`}
                />
              ))}
            </div>
            <Button onClick={handleDownloadPalette} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Palette
            </Button>
          </TabsContent>
          
          <TabsContent value="swatches" className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {palette.colors.map((color) => (
                <div 
                  key={color.hex} 
                  className="rounded-md overflow-hidden border"
                >
                  <div 
                    className="h-16" 
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="p-2">
                    <p className="font-medium text-sm">{color.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-muted-foreground">{color.hex}</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0" 
                        onClick={() => handleCopyColor(color.hex)}
                      >
                        {copiedColor === color.hex ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}