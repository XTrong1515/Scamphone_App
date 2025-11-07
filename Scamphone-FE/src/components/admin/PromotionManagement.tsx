import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Copy, Loader2 } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { adminService } from "../../services/adminService";
import { DiscountForm } from "./DiscountForm";

interface Promotion {
  _id: string;
  code: string;
  name: string;
  type: "percentage" | "fixed_amount" | "free_shipping";
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  status: "active" | "inactive" | "expired";
  usedCount: number;
  maxUses?: number;
}

const typeConfig = {
  percentage: { label: "Phần trăm", color: "bg-blue-100 text-blue-700" },
  fixed_amount: { label: "Số tiền cố định", color: "bg-green-100 text-green-700" },
  free_shipping: {
    label: "Miễn phí ship",
    color: "bg-purple-100 text-purple-700",
  },
};

const statusConfig = {
  active: { label: "Đang chạy", color: "bg-green-100 text-green-700" },
  inactive: { label: "Tạm dừng", color: "bg-blue-100 text-blue-700" },
  expired: { label: "Đã hết hạn", color: "bg-gray-100 text-gray-700" },
};

export function PromotionManagement() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDiscountForm, setShowDiscountForm] = useState(false);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAdminDiscounts({
        page: 1,
        limit: 50,
      });
      setPromotions(response.discounts || []);
    } catch (error) {
      console.error('Error loading promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePromotion = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa mã khuyến mãi này?')) return;
    
    try {
      await adminService.deleteDiscount(id);
      alert('Đã xóa mã khuyến mãi thành công!');
      loadPromotions();
    } catch (error) {
      console.error('Error deleting promotion:', error);
      alert('Có lỗi xảy ra khi xóa mã khuyến mãi!');
    }
  };

  const activePromotions = promotions.filter((p) => p.status === "active").length;
  const totalUsage = promotions.reduce((sum, p) => sum + p.usedCount, 0);

  const formatValue = (promo: Promotion) => {
    if (promo.type === "percentage") {
      return `${promo.value}%`;
    } else if (promo.type === "fixed_amount") {
      return `₫${promo.value.toLocaleString()}`;
    } else {
      return "Miễn phí ship";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Quản lý khuyến mãi</h2>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-purple-600"
          onClick={() => setShowDiscountForm(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tạo khuyến mãi
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-600">Khuyến mãi đang chạy</p>
          <p className="text-3xl font-bold mt-2">{activePromotions}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Tổng lượt sử dụng</p>
          <p className="text-3xl font-bold mt-2">{totalUsage}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Tổng chương trình</p>
          <p className="text-3xl font-bold mt-2">{promotions.length}</p>
        </Card>
      </div>

      {/* Promotions List */}
      <div className="space-y-4">
        {promotions.map((promo) => (
          <Card key={promo._id} className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg">{promo.name}</h3>
                      <Badge className={statusConfig[promo.status].color}>
                        {statusConfig[promo.status].label}
                      </Badge>
                      <Badge className={typeConfig[promo.type].color}>
                        {typeConfig[promo.type].label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <code className="px-3 py-1 bg-gray-100 rounded font-mono">
                        {promo.code}
                      </code>
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Giá trị giảm</p>
                    <p className="font-medium">{formatValue(promo)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Đơn tối thiểu</p>
                    <p className="font-medium">
                      ₫{(promo.minOrderValue / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  {promo.maxDiscount && (
                    <div>
                      <p className="text-gray-600">Giảm tối đa</p>
                      <p className="font-medium">
                        ₫{(promo.maxDiscount / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-600">Thời gian</p>
                    <p className="font-medium">
                      {new Date(promo.startDate).toLocaleDateString('vi-VN')} → {new Date(promo.endDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Đã sử dụng</p>
                    <p className="font-medium">
                      {promo.usedCount}
                      {promo.maxUses && ` / ${promo.maxUses}`}
                    </p>
                  </div>
                  {promo.maxUses && (
                    <div>
                      <p className="text-gray-600">Tỷ lệ sử dụng</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                            style={{
                              width: `${
                                (promo.usedCount / promo.maxUses) * 100
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-xs">
                          {((promo.usedCount / promo.maxUses) * 100).toFixed(
                            0
                          )}
                          %
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex lg:flex-col gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeletePromotion(promo._id)}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Discount Form Modal */}
      {showDiscountForm && (
        <DiscountForm
          onClose={() => setShowDiscountForm(false)}
          onSuccess={loadPromotions}
        />
      )}
    </div>
  );
}
