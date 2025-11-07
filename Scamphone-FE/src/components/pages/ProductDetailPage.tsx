import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription } from "../ui/alert";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Loader2 } from "lucide-react";
import { reviewService, Review } from "../../services/reviewService";
import { socialService, SocialStats } from "../../services/socialService";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CommentSection } from "../CommentSection";
import { ShareDialog } from "../ShareDialog";
import { FavoriteButton } from "../FavoriteButton";
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  ArrowLeft,
  Truck,
  Shield,
  RotateCcw,
  Phone,
  Check,
  Minus,
  Plus
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { AddToCartAnimation } from "../AddToCartAnimation";

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  discount?: number;
  isHot?: boolean;
  description?: string;
  specifications?: { [key: string]: string };
  images?: string[];
}

interface ProductDetailPageProps {
  product: Product;
  user: any | null;
  onPageChange: (page: string) => void;
  onAddToCart: (product: Product) => void;
}

interface ReviewFormData {
  rating: number;
  comment: string;
}

export function ProductDetailPage({ product, user, onPageChange, onAddToCart }: ProductDetailPageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [reviewError, setReviewError] = useState<string>('');
  const [reviewSuccess, setReviewSuccess] = useState<boolean>(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socialStats, setSocialStats] = useState<SocialStats>({
    commentCount: 0,
    favoriteCount: 0,
    shareCount: 0,
    userHasLiked: false,
    userHasFavorited: false
  });
  const [reviewForm, setReviewForm] = useState<ReviewFormData>({
    rating: 5,
    comment: ''
  });
  const [selectedColor, setSelectedColor] = useState("Đen");
  const [selectedStorage, setSelectedStorage] = useState("256GB");
  const [triggerAnimation, setTriggerAnimation] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const images = product.images || [product.image, product.image, product.image];
  const colors = ["Đen", "Trắng", "Xanh", "Tím"];
  const storageOptions = ["128GB", "256GB", "512GB", "1TB"];

  const specifications = product.specifications || {
    "Màn hình": "6.7 inch, Super Retina XDR",
    "Chip": "A17 Pro",
    "Camera": "48MP + 12MP + 12MP",
    "RAM": "8GB",
    "Dung lượng": "256GB",
    "Pin": "4422 mAh",
    "Hệ điều hành": "iOS 17"
  };

  useEffect(() => {
    loadReviews();
    loadSocialData();
  }, [product._id, user?._id]);

  const loadSocialData = async () => {
    try {
      const stats = await socialService.getProductSocialStats(product._id);
      setSocialStats(stats);
      setIsFavorited(stats.userHasFavorited);
    } catch (err: any) {
      console.error('Error loading social stats:', err);
      // Only show error toast for network errors, not auth errors
      if (err.code !== 401) {
        setError(err.message || 'Không thể tải thông tin tương tác');
      }
    }
  };

  useEffect(() => {
    // Reset state when user changes
    if (!user) {
      setIsFavorited(false);
      setSocialStats(prev => ({
        ...prev,
        userHasLiked: false,
        userHasFavorited: false
      }));
    }
  }, [user]);

  const checkFavoriteStatus = async () => {
    if (user) {
      try {
        const isFav = await socialService.isProductFavorited(product._id);
        setIsFavorited(isFav);
      } catch (err) {
        console.error('Error checking favorite status:', err);
      }
    }
  };

  const loadReviews = async () => {
    setIsLoadingReviews(true);
    try {
      const data = await reviewService.getProductReviews(product._id);
      setReviews(data.reviews);
      setTotalReviews(data.total);
    } catch (err) {
      console.error('Error loading reviews:', err);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const handleAddToCart = () => {
    setTriggerAnimation(true);
    const productToAdd = {
      ...product,
      quantity
    };
    onAddToCart(productToAdd);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setReviewError('Vui lòng đăng nhập để đánh giá sản phẩm');
      return;
    }

    if (!reviewForm.comment.trim()) {
      setReviewError('Vui lòng nhập nội dung đánh giá');
      return;
    }

    setIsSubmittingReview(true);
    setReviewError('');

    try {
      await reviewService.createReview({
        product: product._id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      
      // Reset form and reload reviews
      setReviewForm({ rating: 5, comment: '' });
      setReviewSuccess(true);
      loadReviews();
      
      // Hide success message after 3 seconds
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (err: any) {
      setReviewError(err.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => onPageChange('home')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative">
              <ImageWithFallback
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
              />
              {product.discount && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                  -{product.discount}%
                </Badge>
              )}
              {product.isHot && (
                <Badge className="absolute top-4 right-4 bg-orange-500 text-white">
                  HOT
                </Badge>
              )}
            </div>
            
            <div className="flex space-x-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
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
                <span className="text-sm text-gray-600">({product.rating}) | {totalReviews} đánh giá</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{socialStats.commentCount} bình luận</span>
                <span>{socialStats.favoriteCount} lượt thích</span>
                <span>{socialStats.shareCount} lượt chia sẻ</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-blue-600">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              {product.discount && (
                <p className="text-green-600">
                  Tiết kiệm: {formatPrice((product.originalPrice || 0) - product.price)}
                </p>
              )}
            </div>

            {/* Options */}
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Màu sắc:</h3>
                <div className="flex space-x-2">
                  {colors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedColor(color)}
                      className={selectedColor === color ? "bg-blue-600" : ""}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Dung lượng:</h3>
                <div className="flex space-x-2">
                  {storageOptions.map((storage) => (
                    <Button
                      key={storage}
                      variant={selectedStorage === storage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedStorage(storage)}
                      className={selectedStorage === storage ? "bg-blue-600" : ""}
                    >
                      {storage}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Số lượng:</h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 p-0"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 p-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                ref={buttonRef}
                onClick={handleAddToCart}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-2"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Thêm vào giỏ hàng</span>
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <FavoriteButton
                  productId={product._id}
                  isFavorited={isFavorited}
                  onFavoriteChange={setIsFavorited}
                  disabled={!user}
                />
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center space-x-2"
                  onClick={() => setIsShareDialogOpen(true)}
                >
                  <Share2 className="w-4 h-4" />
                  <span>Chia sẻ</span>
                </Button>
              </div>
              
              <ShareDialog
                isOpen={isShareDialogOpen}
                onClose={() => setIsShareDialogOpen(false)}
                productId={product._id}
                title={product.name}
                description={product.description || ""}
                image={product.image}
              />
            </div>

            {/* Benefits */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Miễn phí vận chuyển toàn quốc</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">Bảo hành chính hãng 12 tháng</span>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="w-5 h-5 text-purple-600" />
                  <span className="text-sm">Đổi trả miễn phí trong 7 ngày</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-orange-600" />
                  <span className="text-sm">Hỗ trợ kỹ thuật 24/7</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="description">Mô tả sản phẩm</TabsTrigger>
                <TabsTrigger value="specifications">Thông số kỹ thuật</TabsTrigger>
                <TabsTrigger value="reviews">Đánh giá ({totalReviews})</TabsTrigger>
                <TabsTrigger value="comments">Bình luận ({socialStats.commentCount})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="p-6">
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {product.description || 
                    `${product.name} là sản phẩm công nghệ hàng đầu với thiết kế hiện đại và tính năng vượt trội. 
                    Sản phẩm được thiết kế với chất liệu cao cấp, đảm bảo độ bền và tính thẩm mỹ cao. 
                    Với công nghệ tiên tiến và hiệu suất mạnh mẽ, sản phẩm này sẽ đáp ứng mọi nhu cầu của bạn 
                    trong công việc và giải trí hàng ngày.`}
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="specifications" className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">{key}:</span>
                      <span className="text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="p-6">
                <div className="space-y-6">
                  {/* Review Form */}
                  {user && (
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-4">Viết đánh giá của bạn</h3>
                        <form onSubmit={handleSubmitReview} className="space-y-4">
                          <div>
                            <Label>Đánh giá</Label>
                            <div className="flex space-x-1 mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                  className="focus:outline-none"
                                >
                                  <Star
                                    className={`w-6 h-6 ${
                                      star <= reviewForm.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label>Nhận xét của bạn</Label>
                            <Textarea
                              value={reviewForm.comment}
                              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                              className="mt-1"
                              rows={4}
                            />
                          </div>

                          {reviewError && (
                            <Alert variant="destructive">
                              <AlertDescription>{reviewError}</AlertDescription>
                            </Alert>
                          )}
                          {reviewSuccess && (
                            <Alert className="bg-green-50 border-green-200">
                              <Check className="h-4 w-4 text-green-600" />
                              <AlertDescription className="text-green-600">
                                Cảm ơn bạn đã gửi đánh giá!
                              </AlertDescription>
                            </Alert>
                          )}

                          <Button type="submit" disabled={isSubmittingReview}>
                            {isSubmittingReview ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang gửi...
                              </>
                            ) : (
                              'Gửi đánh giá'
                            )}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {isLoadingReviews ? (
                      <div className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                        <p className="text-gray-500 mt-2">Đang tải đánh giá...</p>
                      </div>
                    ) : reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div key={review._id} className="flex items-center space-x-4 p-4 border rounded-lg">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                            {review.user.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium">{review.user.name}</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="comments" className="p-6">
                <CommentSection
                  productId={product._id}
                  user={user}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <AddToCartAnimation
        trigger={triggerAnimation}
        onComplete={() => setTriggerAnimation(false)}
        buttonRef={buttonRef}
      />
    </div>
  );
}