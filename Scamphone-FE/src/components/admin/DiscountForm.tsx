import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { adminService } from "../../services/adminService";

interface DiscountFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function DiscountForm({ onClose, onSuccess }: DiscountFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "percentage" as "percentage" | "fixed_amount" | "free_shipping",
    value: "",
    maxDiscount: "",
    minOrderValue: "",
    startDate: "",
    endDate: "",
    maxUses: "",
    maxUsesPerUser: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.code || !formData.startDate || !formData.endDate) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    if (formData.type !== "free_shipping" && !formData.value) {
      alert("Vui lòng nhập giá trị giảm giá!");
      return;
    }

    try {
      setLoading(true);

      const discountData = {
        name: formData.name,
        code: formData.code.toUpperCase(),
        type: formData.type,
        value: formData.type === "free_shipping" ? 0 : parseFloat(formData.value),
        maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : undefined,
        minOrderValue: formData.minOrderValue ? parseFloat(formData.minOrderValue) : 0,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined,
        maxUsesPerUser: formData.maxUsesPerUser
          ? parseInt(formData.maxUsesPerUser)
          : undefined,
      };

      await adminService.createDiscount(discountData);
      alert("Tạo mã khuyến mãi thành công!");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error creating discount:", error);
      alert(
        error?.response?.data?.message || "Có lỗi xảy ra khi tạo mã khuyến mãi!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Tạo mã khuyến mãi</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Thông tin cơ bản</h3>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tên chương trình <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Giảm giá Black Friday"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Mã khuyến mãi <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value.toUpperCase() })
                }
                placeholder="BLACKFRIDAY2024"
                required
                maxLength={20}
              />
              <p className="text-xs text-gray-500 mt-1">
                Mã sẽ tự động chuyển thành chữ hoa
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Loại khuyến mãi <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border rounded-md p-2"
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as any,
                  })
                }
                required
              >
                <option value="percentage">Giảm theo phần trăm (%)</option>
                <option value="fixed_amount">Giảm số tiền cố định (₫)</option>
                <option value="free_shipping">Miễn phí vận chuyển</option>
              </select>
            </div>

            {formData.type !== "free_shipping" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Giá trị giảm <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({ ...formData, value: e.target.value })
                    }
                    placeholder={formData.type === "percentage" ? "15" : "500000"}
                    required
                    min="0"
                    max={formData.type === "percentage" ? "100" : undefined}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.type === "percentage"
                      ? "Nhập % giảm giá (0-100)"
                      : "Nhập số tiền giảm"}
                  </p>
                </div>

                {formData.type === "percentage" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Giảm tối đa
                    </label>
                    <Input
                      type="number"
                      value={formData.maxDiscount}
                      onChange={(e) =>
                        setFormData({ ...formData, maxDiscount: e.target.value })
                      }
                      placeholder="3000000"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Số tiền giảm tối đa (₫)
                    </p>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Giá trị đơn hàng tối thiểu
              </label>
              <Input
                type="number"
                value={formData.minOrderValue}
                onChange={(e) =>
                  setFormData({ ...formData, minOrderValue: e.target.value })
                }
                placeholder="1000000"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                Đơn hàng tối thiểu để áp dụng mã (₫)
              </p>
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Thời gian áp dụng</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Ngày bắt đầu <span className="text-red-500">*</span>
                </label>
                <Input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Ngày kết thúc <span className="text-red-500">*</span>
                </label>
                <Input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>

          {/* Usage Limits */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Giới hạn sử dụng</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tổng số lượt sử dụng
                </label>
                <Input
                  type="number"
                  value={formData.maxUses}
                  onChange={(e) =>
                    setFormData({ ...formData, maxUses: e.target.value })
                  }
                  placeholder="1000"
                  min="1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Để trống nếu không giới hạn
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Số lượt/người dùng
                </label>
                <Input
                  type="number"
                  value={formData.maxUsesPerUser}
                  onChange={(e) =>
                    setFormData({ ...formData, maxUsesPerUser: e.target.value })
                  }
                  placeholder="1"
                  min="1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mỗi người dùng có thể dùng bao nhiêu lần
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" className="bg-blue-600" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                "Tạo mã khuyến mãi"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
