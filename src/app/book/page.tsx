
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function BookPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-12">
        <h1 className="text-4xl font-bold">Book a Service</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Our booking page is coming soon. For now, please start with our questionnaire.
        </p>
      </main>
      <Footer />
    </div>
  );
}
