import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';
import { Facebook, Twitter, Link as LinkIcon, Copy, Check } from 'lucide-react';
import { socialService } from '../services/socialService';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  title: string;
  description: string;
  image: string;
}

export function ShareDialog({
  isOpen,
  onClose,
  productId,
  title,
  description,
  image
}: ShareDialogProps) {
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const getShareLink = async () => {
    try {
      const { shareUrl } = await socialService.getShareLink(productId);
      setShareUrl(shareUrl);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tạo link chia sẻ');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(url, '_blank');
  };

  const handleTwitterShare = () => {
    const shareText = `Xem sản phẩm ${title} tại ScamPhone`;
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      shareUrl
      )}&text=${encodeURIComponent(`Xem sản phẩm ${title} tại ScamPhone`)}`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    if (isOpen && !shareUrl && !error) {
      getShareLink();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => {
      if (!open) {
        setShareUrl('');
        setError('');
        setCopied(false);
      }
      onClose();
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chia sẻ sản phẩm</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={handleFacebookShare}
                >
                  <Facebook className="mr-2 h-5 w-5 text-blue-600" />
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={handleTwitterShare}
                >
                  <Twitter className="mr-2 h-5 w-5 text-blue-400" />
                  Twitter
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="flex-1"
                  placeholder="Đang tạo link..."
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                  title="Copy link"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}