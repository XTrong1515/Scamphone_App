import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Loader2, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { orderService, Order } from '../../services/orderService';

interface OrderHistoryPageProps {
  onPageChange: (page: string) => void;
}

const OrderStatusIcon = ({ status }: { status: Order['status'] }) => {
  switch (status) {
    case 'pending':
      return <Package className="w-5 h-5 text-orange-500" />;
    case 'processing':
      return <Package className="w-5 h-5 text-blue-500" />;
    case 'shipped':
      return <Truck className="w-5 h-5 text-purple-500" />;
    case 'delivered':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'cancelled':
      return <XCircle className="w-5 h-5 text-red-500" />;
    default:
      return null;
  }
};

const OrderStatusText = ({ status }: { status: Order['status'] }) => {
  const statusMap = {
    pending: 'Chờ xác nhận',
    processing: 'Đang xử lý',
    shipped: 'Đang giao hàng',
    delivered: 'Đã giao hàng',
    cancelled: 'Đã hủy'
  };

  return (
    <span className={`
      px-2 py-1 rounded-full text-sm font-medium
      ${status === 'pending' ? 'bg-orange-100 text-orange-700' : ''}
      ${status === 'processing' ? 'bg-blue-100 text-blue-700' : ''}
      ${status === 'shipped' ? 'bg-purple-100 text-purple-700' : ''}
      ${status === 'delivered' ? 'bg-green-100 text-green-700' : ''}
      ${status === 'cancelled' ? 'bg-red-100 text-red-700' : ''}
    `}>
      {statusMap[status]}
    </span>
  );
};

export function OrderHistoryPage({ onPageChange }: OrderHistoryPageProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await orderService.getUserOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải danh sách đơn hàng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await orderService.cancelOrder(orderId);
      // Reload orders after cancellation
      loadOrders();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể hủy đơn hàng');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-8">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Lịch sử đơn hàng</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">Bạn chưa có đơn hàng nào</p>
            <Button
              onClick={() => onPageChange('home')}
              className="mt-4"
            >
              Mua sắm ngay
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order._id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <OrderStatusIcon status={order.status} />
                    <OrderStatusText status={order.status} />
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <div className="space-y-4">
                  {(() => {
                    const items = (order as any).items ?? (order as any).orderItems ?? [];
                    return items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{item.product ?? item.name}</h3>
                          <p className="text-sm text-gray-500">
                            Số lượng: {item.quantity ?? item.qty}
                          </p>
                        </div>
                        <span className="font-medium">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format((item.price ?? item.unitPrice ?? 0) * (item.quantity ?? item.qty ?? 0))}
                        </span>
                      </div>
                    ));
                  })()}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Tổng tiền</p>
                      <p className="text-lg font-bold">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(order.totalAmount)}
                      </p>
                    </div>
                    <div className="space-x-2">
                      {order.status === 'pending' && (
                        <Button
                          variant="destructive"
                          onClick={() => handleCancelOrder(order._id)}
                        >
                          Hủy đơn hàng
                        </Button>
                      )}
                      <Button variant="outline" onClick={() => onPageChange(`order-detail/${order._id}`)}>
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}