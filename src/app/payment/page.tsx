
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function PaymentPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-12">
        <h1 className="text-4xl font-bold">Payment</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Our secure payment page is under construction. Please complete the questionnaire to proceed.
        </p>
      </main>
      <Footer />
    </div>
  );
}
