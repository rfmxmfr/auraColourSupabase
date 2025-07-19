
'use client';
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";

interface FeedbackConfirmationProps {
  onReset: () => void;
}

export function FeedbackConfirmation({ onReset }: FeedbackConfirmationProps) {
  return (
    <div className="flex flex-col items-center text-center p-6">
        <ThumbsUp className="h-16 w-16 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
        <p className="text-muted-foreground mb-6">
            Your feedback has been received. We appreciate you taking the time to help us improve.
        </p>
        <Button onClick={onReset}>Close</Button>
    </div>
  );
}
