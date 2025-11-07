import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { adminService } from "../../services/adminService";
import { ProductForm } from "./ProductForm";
import { categoryService } from "../../services/categoryService";

interface Product {
  _id: string;
  name: string;
  category: { _id: string; name: string };
  price: number;
  originalPrice?: number;
  stock_quantity: number;
  status: "active" | "inactive" | "out_of_stock";
  image: string;
  images?: string[];
  brand?: string;
  discount?: number;
  isNewProduct?: boolean;
}

const statusConfig = {
  active: { label: "Đang bán", color: "bg-green-100 text-green-700" },
  inactive: { label: "Ngừng bán", color: "bg-gray-100 text-gray-700" },
  out_of_stock: { label: "Hết hàng", color: "bg-red-100 text-red-700" },
};

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Array<{ _id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [page, searchTerm]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAdminProducts({
        page,
        limit: 20,
        search: searchTerm || undefined,
      });
      setProducts(response.products || []);
      setTotalPages(response.pages || 1);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    
    try {
      await adminService.deleteProduct(id);
      alert('Đã xóa sản phẩm thành công!');
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Có lỗi xảy ra khi xóa sản phẩm!');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleCloseForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleFormSuccess = () => {
    loadProducts();
    handleCloseForm();
  };

  const filteredProducts = products;

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
        <h2 className="text-3xl font-bold">Quản lý sản phẩm</h2>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-purple-600"
          onClick={() => setShowProductForm(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Search */}
      <Card className="p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Products Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Sản phẩm</th>
                <th className="text-left py-3 px-4">Danh mục</th>
                <th className="text-left py-3 px-4">Giá bán</th>
                <th className="text-left py-3 px-4">Tồn kho</th>
                <th className="text-left py-3 px-4">Trạng thái</th>
                <th className="text-left py-3 px-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">ID: {product._id.slice(0, 8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{product.category.name}</td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium">
                        ₫{product.price.toLocaleString()}
                      </div>
                      {product.originalPrice && product.originalPrice !== product.price && (
                        <div className="text-sm text-gray-500 line-through">
                          ₫{product.originalPrice.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={
                        product.stock_quantity < 10
                          ? "text-red-600 font-medium"
                          : "text-gray-900"
                      }
                    >
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={statusConfig[product.status].color}>
                      {statusConfig[product.status].label}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
          categories={categories}
        />
      )}
    </div>
  );
}
