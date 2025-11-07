import { useState } from "react";
import { Search, AlertTriangle, Package } from "lucide-react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  location: string;
  lastUpdated: string;
}

const mockInventory: InventoryItem[] = [
  {
    id: "1",
    name: "iPhone 15 Pro Max 256GB",
    sku: "IP15PM-256",
    category: "Điện thoại",
    stock: 45,
    minStock: 20,
    price: 32990000,
    location: "Kho A - K1",
    lastUpdated: "2025-10-01",
  },
  {
    id: "2",
    name: "Samsung Galaxy S24 Ultra",
    sku: "SS24U-512",
    category: "Điện thoại",
    stock: 12,
    minStock: 15,
    price: 28990000,
    location: "Kho A - K2",
    lastUpdated: "2025-10-01",
  },
  {
    id: "3",
    name: "MacBook Pro M3 14 inch",
    sku: "MBP-M3-14",
    category: "Laptop",
    stock: 8,
    minStock: 10,
    price: 45990000,
    location: "Kho B - L1",
    lastUpdated: "2025-09-30",
  },
  {
    id: "4",
    name: "iPad Pro M2 11 inch",
    sku: "IPP-M2-11",
    category: "Tablet",
    stock: 25,
    minStock: 15,
    price: 22990000,
    location: "Kho A - T1",
    lastUpdated: "2025-10-01",
  },
  {
    id: "5",
    name: "AirPods Pro 2",
    sku: "APP-2",
    category: "Phụ kiện",
    stock: 5,
    minStock: 30,
    price: 6490000,
    location: "Kho C - P1",
    lastUpdated: "2025-09-29",
  },
  {
    id: "6",
    name: "Apple Watch Series 9",
    sku: "AW-S9",
    category: "Phụ kiện",
    stock: 18,
    minStock: 12,
    price: 10990000,
    location: "Kho C - P2",
    lastUpdated: "2025-10-01",
  },
];

export function InventoryManagement() {
  const [inventory] = useState<InventoryItem[]>(mockInventory);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = inventory.filter((item) => item.stock < item.minStock);
  const totalValue = inventory.reduce(
    (sum, item) => sum + item.stock * item.price,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Quản lý kho hàng</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng sản phẩm</p>
              <p className="text-2xl font-bold">{inventory.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Sản phẩm sắp hết</p>
              <p className="text-2xl font-bold">{lowStockItems.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Giá trị kho</p>
              <p className="text-2xl font-bold">₫{(totalValue / 1000000).toFixed(0)}M</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="p-6 border-yellow-200 bg-yellow-50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-bold text-yellow-900">Cảnh báo tồn kho thấp</h3>
              <p className="text-sm text-yellow-700 mt-1">
                {lowStockItems.length} sản phẩm đang dưới mức tồn kho tối thiểu
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {lowStockItems.map((item) => (
                  <Badge key={item.id} variant="outline" className="bg-white">
                    {item.name} ({item.stock}/{item.minStock})
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Search */}
      <Card className="p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Tìm kiếm theo tên hoặc SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Inventory Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">SKU</th>
                <th className="text-left py-3 px-4">Tên sản phẩm</th>
                <th className="text-left py-3 px-4">Danh mục</th>
                <th className="text-left py-3 px-4">Tồn kho</th>
                <th className="text-left py-3 px-4">Vị trí</th>
                <th className="text-left py-3 px-4">Giá trị</th>
                <th className="text-left py-3 px-4">Cập nhật</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => {
                const isLowStock = item.stock < item.minStock;
                return (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{item.sku}</td>
                    <td className="py-3 px-4">{item.name}</td>
                    <td className="py-3 px-4">{item.category}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-medium ${
                            isLowStock ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {item.stock}
                        </span>
                        {isLowStock && (
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        Tối thiểu: {item.minStock}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{item.location}</td>
                    <td className="py-3 px-4 font-medium">
                      ₫{((item.stock * item.price) / 1000000).toFixed(1)}M
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {item.lastUpdated}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
