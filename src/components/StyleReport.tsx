import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Home } from "lucide-react";

interface SubmissionConfirmationProps {
  message: string;
  onReset: () => void;
}

export function SubmissionConfirmation({ message, onReset }: SubmissionConfirmationProps) {
  return (
    <div className="flex flex-col items-center text-center">
        <Card className="w-full max-w-2xl">
        <CardHeader>
            <div className="mx-auto w-fit rounded-full bg-primary/10 p-3">
                <CheckCircle className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="font-headline mt-4 text-3xl">Submission Successful!</CardTitle>
            <CardDescription>
                Thank you for trusting Aura Colours.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="whitespace-pre-wrap font-body text-card-foreground leading-relaxed">
              {message}
            </p>
        </CardContent>
        </Card>
        <Button onClick={onReset} className="mt-8" size="lg">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
        </Button>
    </div>
  );
}
