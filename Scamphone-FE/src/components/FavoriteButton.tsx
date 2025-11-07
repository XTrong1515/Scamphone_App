import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Heart } from 'lucide-react';
import { socialService } from '../services/socialService';

interface FavoriteButtonProps {
  productId: string;
  isFavorited: boolean;
  onFavoriteChange: (isFavorited: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function FavoriteButton({
  productId,
  isFavorited,
  onFavoriteChange,
  disabled = false,
  className = ''
}: FavoriteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleFavorite = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    setError(null);
    
    try {
      if (isFavorited) {
        await socialService.removeFromFavorites(productId);
      } else {
        await socialService.addToFavorites(productId);
      }
      onFavoriteChange(!isFavorited);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
      console.error('Error toggling favorite:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        className={`flex items-center space-x-2 ${className}`}
        onClick={handleToggleFavorite}
        disabled={disabled || isLoading}
      >
        <Heart
          className={`h-5 w-5 transition-colors ${
            isFavorited
              ? 'fill-red-500 text-red-500'
              : 'text-gray-500 group-hover:text-red-500'
          }`}
        />
        <span>{isFavorited ? 'Đã thích' : 'Yêu thích'}</span>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
          </div>
        )}
      </Button>
      {error && (
        <div className="absolute top-full mt-1 w-full">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}