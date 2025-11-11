import { CheckCircle, Package, Home, Receipt } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useEffect } from "react";

interface OrderSuccessPageProps {
  onPageChange: (page: string) => void;
  orderData?: {
    orderId: string;
  };
}

export function OrderSuccessPage({ onPageChange, orderData }: OrderSuccessPageProps) {
  useEffect(() => {
    // Confetti effect or animation can be added here
  }, []);

  const orderId = orderData?.orderId || '';
  const orderNumber = orderId.slice(-8).toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-white overflow-hidden">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Đặt hàng thành công!</h1>
          <p className="text-white/90">
            Cảm ơn bạn đã mua sắm tại ScamPhone
          </p>
        </div>

        {/* Order Info */}
        <div className="p-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Receipt className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Thông tin đơn hàng</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Mã đơn hàng:</span>
                <span className="font-bold text-blue-600">#{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thời gian đặt:</span>
                <span className="font-medium text-gray-900">
                  {new Date().toLocaleString('vi-VN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái:</span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                  <Package className="w-4 h-4" />
                  Chờ xác nhận
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-3">Bước tiếp theo:</h3>
            <div className="space-y-3">
              <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900">Admin sẽ xác nhận đơn hàng</p>
                  <p className="text-sm text-gray-600">Chúng tôi sẽ kiểm tra và xác nhận đơn hàng của bạn trong thời gian sớm nhất</p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900">Chuẩn bị và giao hàng</p>
                  <p className="text-sm text-gray-600">Đơn hàng sẽ được đóng gói cẩn thận và giao đến địa chỉ của bạn</p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900">Nhận hàng và thanh toán</p>
                  <p className="text-sm text-gray-600">Kiểm tra sản phẩm và thanh toán khi nhận hàng (nếu chọn COD)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              📢 <strong>Lưu ý:</strong> Bạn sẽ nhận được thông báo qua hệ thống khi đơn hàng được xác nhận hoặc có bất kỳ thay đổi nào.
            </p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              onClick={() => onPageChange('orders')}
              className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium"
            >
              <Package className="w-5 h-5 mr-2" />
              Xem đơn hàng của tôi
            </Button>
            <Button
              onClick={() => onPageChange('home')}
              variant="outline"
              className="h-12 font-medium"
            >
              <Home className="w-5 h-5 mr-2" />
              Về trang chủ
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
