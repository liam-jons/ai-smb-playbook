import { useState, useEffect } from 'react';
import { MessageSquareHeart } from 'lucide-react';
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
import { siteConfig } from '@/config/site';

const CATEGORIES = [
  { value: 'more-info', label: 'Request more info' },
  { value: 'issue', label: 'Report an issue' },
  { value: 'general', label: 'General feedback' },
] as const;

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');

  // Listen for custom event from header/footer
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-feedback', handler);
    return () => window.removeEventListener('open-feedback', handler);
  }, []);

  const handleSubmit = () => {
    const categoryLabel =
      CATEGORIES.find((c) => c.value === category)?.label ?? 'Feedback';
    const subject = encodeURIComponent(
      `${siteConfig.emailSubjectPrefix} — ${categoryLabel}`
    );
    const body = encodeURIComponent(message);
    const mailtoUrl = `mailto:${siteConfig.feedbackEmail}?subject=${subject}&body=${body}`;

    window.open(mailtoUrl, '_blank');
    setOpen(false);
    setCategory('');
    setMessage('');
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Feedback</DialogTitle>
            <DialogDescription>
              Let us know how we can improve this playbook. Your feedback is
              sent via email.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="feedback-category"
                className="text-sm font-medium"
              >
                Category
              </label>
              <Select value={category} onValueChange={setCategory}>
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
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!category || !message.trim()}
              >
                Send Feedback
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
