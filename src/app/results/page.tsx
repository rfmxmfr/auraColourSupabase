
import { ColorPalette } from '@/components/ColorPalette';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export default function ResultsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex items-center justify-center">
        <div className="w-full max-w-md">
            <ColorPalette />
        </div>
      </main>
      <Footer />
    </div>
  );
}
