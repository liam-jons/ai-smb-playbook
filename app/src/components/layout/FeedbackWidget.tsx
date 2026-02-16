import { useState, useEffect } from 'react';
import {
  MessageSquareHeart,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const CATEGORIES = [
  { value: 'more-info', label: 'Request more info' },
  { value: 'issue', label: 'Report an issue' },
  { value: 'general', label: 'General feedback' },
] as const;

type SubmitState = 'idle' | 'sending' | 'success' | 'error';

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Listen for custom event from header/footer
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-feedback', handler);
    return () => window.removeEventListener('open-feedback', handler);
  }, []);

  // Auto-close after success
  useEffect(() => {
    if (submitState !== 'success') return;
    const timer = setTimeout(() => {
      setOpen(false);
      // Reset form after dialog closes
      setTimeout(() => {
        setCategory('');
        setMessage('');
        setSubmitState('idle');
        setErrorMessage('');
      }, 200);
    }, 2000);
    return () => clearTimeout(timer);
  }, [submitState]);

  // Reset state when dialog closes (if not in success auto-close flow)
  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen && submitState !== 'success') {
      setTimeout(() => {
        setSubmitState('idle');
        setErrorMessage('');
      }, 200);
    }
  };

  const handleSubmit = async () => {
    setSubmitState('sending');
    setErrorMessage('');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, message: message.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Something went wrong');
      }

      setSubmitState('success');
    } catch (err) {
      setSubmitState('error');
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Failed to send feedback. Please try again.',
      );
    }
  };

  return (
    <>
      {/* Floating button — visible on all pages */}
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg md:hidden"
        size="icon"
        aria-label="Send feedback"
      >
        <MessageSquareHeart className="h-5 w-5" />
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Feedback</DialogTitle>
            <DialogDescription>
              Let us know how we can improve this playbook.
            </DialogDescription>
          </DialogHeader>

          {submitState === 'success' ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <CheckCircle2 className="h-10 w-10 text-success" />
              <div>
                <p className="font-medium text-foreground">
                  Thanks for your feedback!
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  We'll review it and get back to you if needed.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="feedback-category"
                  className="text-sm font-medium"
                >
                  Category
                </label>
                <Select
                  value={category}
                  onValueChange={setCategory}
                  disabled={submitState === 'sending'}
                >
                  <SelectTrigger id="feedback-category">
                    <SelectValue placeholder="Choose a category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="feedback-message"
                  className="text-sm font-medium"
                >
                  Message
                </label>
                <Textarea
                  id="feedback-message"
                  placeholder="Tell us what you think..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  disabled={submitState === 'sending'}
                  maxLength={5000}
                />
              </div>

              {submitState === 'error' && (
                <div className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <p className="text-sm text-destructive">{errorMessage}</p>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  disabled={submitState === 'sending'}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={
                    !category || !message.trim() || submitState === 'sending'
                  }
                >
                  {submitState === 'sending' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Feedback'
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
