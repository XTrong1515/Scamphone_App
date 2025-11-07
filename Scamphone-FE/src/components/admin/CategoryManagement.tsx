import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2, X, Save } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { categoryService, Category } from "../../services/categoryService";

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
      alert("Không thể tải danh mục!");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name });
    } else {
      setEditingCategory(null);
      setFormData({ name: "" });
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({ name: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên danh mục!");
      return;
    }

    try {
      setSubmitting(true);
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory._id, formData);
        alert("Cập nhật danh mục thành công!");
      } else {
        await categoryService.createCategory(formData);
        alert("Thêm danh mục thành công!");
      }
      handleCloseForm();
      loadCategories();
    } catch (error: any) {
      console.error("Error saving category:", error);
      alert(error.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`)) {
      return;
    }

    try {
      await categoryService.deleteCategory(category._id);
      alert("Xóa danh mục thành công!");
      loadCategories();
    } catch (error: any) {
      console.error("Error deleting category:", error);
      alert(error.response?.data?.message || "Không thể xóa danh mục!");
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
        <h2 className="text-3xl font-bold">Quản lý danh mục</h2>
        <Button
          onClick={() => handleOpenForm()}
          className="bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm danh mục
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-600">Tổng danh mục</p>
          <p className="text-3xl font-bold mt-2 text-blue-600">
            {categories.length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Danh mục mới nhất</p>
          <p className="text-lg font-semibold mt-2 text-gray-900">
            {categories[0]?.name || "Chưa có"}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Cập nhật gần đây</p>
          <p className="text-sm mt-2 text-gray-600">
            {categories[0]?.updatedAt
              ? new Date(categories[0].updatedAt).toLocaleDateString("vi-VN")
              : "N/A"}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">STT</th>
                <th className="text-left py-3 px-4 font-semibold">
                  Tên danh mục
                </th>
                <th className="text-left py-3 px-4 font-semibold">
                  Ngày tạo
                </th>
                <th className="text-left py-3 px-4 font-semibold">
                  Cập nhật
                </th>
                <th className="text-right py-3 px-4 font-semibold">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    Chưa có danh mục nào. Hãy thêm danh mục mới!
                  </td>
                </tr>
              ) : (
                categories.map((category, index) => (
                  <tr
                    key={category._id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">
                        {category.name}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(category.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(category.updatedAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenForm(category)}
                          className="hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(category)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {showForm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseForm}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold">
                {editingCategory ? "Sửa danh mục" : "Thêm danh mục mới"}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCloseForm}
                disabled={submitting}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên danh mục <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ví dụ: Điện thoại, Laptop..."
                    required
                    disabled={submitting}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tên danh mục sẽ hiển thị trên trang chủ
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseForm}
                  disabled={submitting}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {editingCategory ? "Cập nhật" : "Thêm mới"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
