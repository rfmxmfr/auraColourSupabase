
'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Star, Send, ThumbsUp } from 'lucide-react';
import { submitFeedbackAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { FeedbackConfirmation } from './FeedbackConfirmation';

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const pathname = usePathname();
  const { toast } = useToast();

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({
        variant: 'destructive',
        title: 'Rating Required',
        description: 'Please select a star rating before submitting.',
      });
      return;
    }
    setIsSubmitting(true);
    const result = await submitFeedbackAction({
      rating,
      comment,
      page: pathname,
    });
    setIsSubmitting(false);

    if (result.success) {
      setIsSubmitted(true);
    } else {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: result.error || 'Something went wrong. Please try again.',
      });
    }
  };

  const resetForm = () => {
    setIsOpen(false);
    setTimeout(() => {
        setRating(0);
        setComment('');
        setIsSubmitted(false);
    }, 300); // allow dialog to close before resetting
  }

  return (
    <>
      <Button
        className="fixed bottom-4 right-4 rounded-full h-14 w-14 shadow-lg z-50"
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare className="h-6 w-6" />
        <span className="sr-only">Provide Feedback</span>
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
            {isSubmitted ? (
                <FeedbackConfirmation onReset={resetForm} />
            ) : (
                <>
                <DialogHeader>
                    <DialogTitle>Share Your Feedback</DialogTitle>
                    <DialogDescription>We value your opinion. Let us know how we can improve.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">How would you rate your experience?</label>
                        <div className="flex justify-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                            key={star}
                            type="button"
                            onClick={() => handleRating(star)}
                            className="focus:outline-none"
                            >
                            <Star
                                className={`h-8 w-8 transition-colors ${
                                rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                }`}
                            />
                            </button>
                        ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="comment" className="block text-sm font-medium mb-2">Any comments or suggestions?</label>
                        <Textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tell us what you think..."
                        rows={4}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                        <Send className="ml-2 h-4 w-4" />
                    </Button>
                </form>
                </>
            )}
        </DialogContent>
      </Dialog>
    </>
  );
}
