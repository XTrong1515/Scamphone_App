import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { orderService } from "../../services/orderService";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  discount?: number;
}

interface CartPageProps {
  cartItems: CartItem[];
  user: any | null;
  onUpdateCart: (items: CartItem[]) => void;
  onPageChange: (page: string) => void;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export function CartPage({ cartItems, user, onUpdateCart, onPageChange }: CartPageProps) {
  const [promoCode, setPromoCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Vietnam"
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    
    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    onUpdateCart(updatedItems);
  };

  const removeItem = (id: string) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    onUpdateCart(updatedItems);
  };

  const handleCheckout = async () => {
    if (!user) {
      setError("Vui lòng đăng nhập để tiếp tục thanh toán");
      return;
    }

    if (!validateShippingAddress()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await orderService.createOrder({
        products: cartItems.map(item => ({
          product: item.id,
          quantity: item.quantity
        })),
        shippingAddress
      });

      // Clear cart after successful order
      onUpdateCart([]);
      setShowCheckout(false);
      onPageChange('home');
    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateShippingAddress = () => {
    if (!shippingAddress.street) {
      setError("Vui lòng nhập địa chỉ");
      return false;
    }
    if (!shippingAddress.city) {
      setError("Vui lòng nhập thành phố");
      return false;
    }
    if (!shippingAddress.state) {
      setError("Vui lòng nhập tỉnh/thành phố");
      return false;
    }
    if (!shippingAddress.zipCode) {
      setError("Vui lòng nhập mã bưu điện");
      return false;
    }
    return true;
  };

  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const originalAmount = cartItems.reduce((total, item) => {
    const originalPrice = item.originalPrice || item.price;
    return total + (originalPrice * item.quantity);
  }, 0);
  const totalDiscount = originalAmount - totalAmount;
  const shippingFee = totalAmount >= 500000 ? 0 : 30000;
  const finalAmount = totalAmount + shippingFee;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => onPageChange('home')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại mua sắm</span>
            </Button>
          </div>
          
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Giỏ hàng của bạn đang trống</h2>
            <p className="text-gray-600 mb-8">Hãy khám phá các sản phẩm tuyệt vời của chúng tôi</p>
            <Button 
              onClick={() => onPageChange('home')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Tiếp tục mua sắm
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => onPageChange('home')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tiếp tục mua sắm</span>
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn ({cartItems.length} sản phẩm)</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-2">{item.name}</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg font-bold text-blue-600">
                          {formatPrice(item.price)}
                        </span>
                        {item.originalPrice && (
                          <>
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(item.originalPrice)}
                            </span>
                            {item.discount && (
                              <Badge className="bg-red-500 text-white">
                                -{item.discount}%
                              </Badge>
                            )}
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 p-0"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 text-center"
                            min="1"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 p-0"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Tiết kiệm:</span>
                    <span>-{formatPrice(totalDiscount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span className={shippingFee === 0 ? "text-green-600" : ""}>
                    {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
                  </span>
                </div>
                
                {totalAmount < 500000 && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-600">
                      Mua thêm {formatPrice(500000 - totalAmount)} để được miễn phí vận chuyển
                    </p>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-blue-600">{formatPrice(finalAmount)}</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Mã giảm giá"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button variant="outline">Áp dụng</Button>
                  </div>
                  
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700" 
            size="lg"
            onClick={() => {
              if (!user) {
                setError("Vui lòng đăng nhập để tiếp tục thanh toán");
                return;
              }
              setShowCheckout(true);
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              'Tiến hành thanh toán'
            )}
          </Button>                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => onPageChange('home')}
                  >
                    Tiếp tục mua sắm
                  </Button>
                </div>
                
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span>✓</span>
                    <span>Miễn phí đổi trả trong 30 ngày</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>✓</span>
                    <span>Bảo hành chính hãng</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>✓</span>
                    <span>Hỗ trợ kỹ thuật 24/7</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thông tin giao hàng</DialogTitle>
            <DialogDescription>
              Vui lòng nhập thông tin giao hàng chính xác
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="street">Địa chỉ</Label>
              <Input
                id="street"
                value={shippingAddress.street}
                onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                placeholder="Số nhà, tên đường"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="city">Quận/Huyện</Label>
              <Input
                id="city"
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                placeholder="Quận/Huyện"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state">Tỉnh/Thành phố</Label>
              <Input
                id="state"
                value={shippingAddress.state}
                onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                placeholder="Tỉnh/Thành phố"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="zipCode">Mã bưu điện</Label>
              <Input
                id="zipCode"
                value={shippingAddress.zipCode}
                onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                placeholder="Mã bưu điện"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCheckout(false)}>
              Hủy
            </Button>
            <Button onClick={handleCheckout} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Xác nhận đặt hàng'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}