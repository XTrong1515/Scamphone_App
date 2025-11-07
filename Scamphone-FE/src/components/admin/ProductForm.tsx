import { useState } from "react";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { adminService } from "../../services/adminService";

interface ProductFormProps {
  product?: {
    _id: string;
    name: string;
    description?: string;
    price: number;
    originalPrice?: number;
    stock_quantity: number;
    category: { _id: string; name: string } | string;
    brand?: string;
    images?: string[];
    image?: string;
    specifications?: Record<string, string>;
    discount?: number;
    isHot?: boolean;
  } | null;
  onClose: () => void;
  onSuccess: () => void;
  categories: Array<{ _id: string; name: string }>;
}

export function ProductForm({ product, onClose, onSuccess, categories }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  
  // Initialize form data with product data if editing
  const getInitialFormData = () => {
    if (product) {
      const categoryId = typeof product.category === 'string' 
        ? product.category 
        : product.category._id;
      
      const specsArray = product.specifications
        ? Object.entries(product.specifications).map(([key, value]) => ({ key, value }))
        : [{ key: "", value: "" }];
      
      const images = product.images && product.images.length > 0 
        ? product.images 
        : product.image 
        ? [product.image] 
        : [""];
      
      return {
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        originalPrice: product.originalPrice?.toString() || "",
        stock_quantity: product.stock_quantity?.toString() || "",
        category: categoryId,
        brand: product.brand || "",
        images,
        specifications: specsArray,
        discount: product.discount?.toString() || "",
        isHot: product.isHot || false,
      };
    }
    
    return {
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      stock_quantity: "",
      category: "",
      brand: "",
      images: [""],
      specifications: [{ key: "", value: "" }],
      discount: "",
      isHot: false,
    };
  };

  const [formData, setFormData] = useState(getInitialFormData());

  const handleAddImage = () => {
    setFormData({ ...formData, images: [...formData.images, ""] });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages.length > 0 ? newImages : [""] });
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const handleAddSpecification = () => {
    setFormData({
      ...formData,
      specifications: [...formData.specifications, { key: "", value: "" }],
    });
  };

  const handleRemoveSpecification = (index: number) => {
    const newSpecs = formData.specifications.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      specifications: newSpecs.length > 0 ? newSpecs : [{ key: "", value: "" }],
    });
  };

  const handleSpecificationChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index][field] = value;
    setFormData({ ...formData, specifications: newSpecs });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.price || !formData.category || !formData.stock_quantity) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    try {
      setLoading(true);

      // Convert specifications array to object
      const specifications: Record<string, string> = {};
      formData.specifications.forEach((spec) => {
        if (spec.key && spec.value) {
          specifications[spec.key] = spec.value;
        }
      });

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice
          ? parseFloat(formData.originalPrice)
          : parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        category: formData.category,
        brand: formData.brand,
        images: formData.images.filter((img) => img.trim() !== ""),
        image: formData.images[0] || "",
        specifications,
        discount: formData.discount ? parseFloat(formData.discount) : 0,
        isHot: formData.isHot,
      };

      if (product) {
        // Update existing product
        await adminService.updateProduct(product._id, productData);
        alert("Cập nhật sản phẩm thành công!");
      } else {
        // Create new product
        await adminService.createProduct(productData);
        alert("Thêm sản phẩm thành công!");
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error saving product:", error);
      alert(error?.response?.data?.message || `Có lỗi xảy ra khi ${product ? 'cập nhật' : 'thêm'} sản phẩm!`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {product ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h2>
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
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="iPhone 15 Pro Max 256GB"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mô tả</label>
              <textarea
                className="w-full border rounded-md p-2 min-h-[100px]"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Mô tả chi tiết sản phẩm..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Giá bán <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="29990000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Giá gốc</label>
                <Input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, originalPrice: e.target.value })
                  }
                  placeholder="34990000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Số lượng <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, stock_quantity: e.target.value })
                  }
                  placeholder="100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border rounded-md p-2"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Thương hiệu</label>
                <Input
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="Apple"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Giảm giá (%)
                </label>
                <Input
                  type="number"
                  value={formData.discount}
                  onChange={(e) =>
                    setFormData({ ...formData, discount: e.target.value })
                  }
                  placeholder="15"
                  min="0"
                  max="100"
                />
              </div>

              <div className="flex items-center gap-2 pt-8">
                <input
                  type="checkbox"
                  id="isHot"
                  checked={formData.isHot}
                  onChange={(e) =>
                    setFormData({ ...formData, isHot: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <label htmlFor="isHot" className="text-sm font-medium">
                  Sản phẩm HOT
                </label>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Hình ảnh</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddImage}
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm ảnh
              </Button>
            </div>

            {formData.images.map((image, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.images.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Specifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Thông số kỹ thuật</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSpecification}
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm thông số
              </Button>
            </div>

            {formData.specifications.map((spec, index) => (
              <div key={index} className="grid grid-cols-5 gap-2">
                <Input
                  className="col-span-2"
                  value={spec.key}
                  onChange={(e) =>
                    handleSpecificationChange(index, "key", e.target.value)
                  }
                  placeholder="Màn hình"
                />
                <Input
                  className="col-span-2"
                  value={spec.value}
                  onChange={(e) =>
                    handleSpecificationChange(index, "value", e.target.value)
                  }
                  placeholder="6.7 inch OLED"
                />
                {formData.specifications.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveSpecification(index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-blue-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {product ? "Đang cập nhật..." : "Đang thêm..."}
                </>
              ) : (
                product ? "Cập nhật sản phẩm" : "Thêm sản phẩm"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
