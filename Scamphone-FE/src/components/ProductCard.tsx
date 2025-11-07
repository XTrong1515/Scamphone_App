import { useRef, useState } from "react";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { AddToCartAnimation } from "./AddToCartAnimation";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  discount?: number;
  isHot?: boolean;
  isNewProduct?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onProductClick }: ProductCardProps) {
  const [triggerAnimation, setTriggerAnimation] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddToCart = () => {
    setTriggerAnimation(true);
    onAddToCart(product);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="relative cursor-pointer" onClick={() => onProductClick(product)}>
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.discount && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            -{product.discount}%
          </Badge>
        )}
        {product.isNewProduct && (
          <Badge className="absolute top-2 left-2 bg-green-500 text-white">
            NEW
          </Badge>
        )}
        {product.isHot && (
          <Badge className="absolute top-2 right-2 bg-orange-500 text-white">
            HOT
          </Badge>
        )}
      </div>
      
      <div className="p-4">
        <h3 
          className="font-medium text-gray-900 mb-2 line-clamp-2 min-h-[3rem] cursor-pointer hover:text-blue-600"
          onClick={() => onProductClick(product)}
        >
          {product.name}
        </h3>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">({product.rating})</span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-lg font-bold text-blue-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
        
        <Button
          ref={buttonRef}
          onClick={handleAddToCart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-2"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Thêm vào giỏ</span>
        </Button>
      </div>
      
      <AddToCartAnimation
        trigger={triggerAnimation}
        onComplete={() => setTriggerAnimation(false)}
        buttonRef={buttonRef}
      />
    </div>
  );
}