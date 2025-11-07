import { Card } from "../ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

const monthlyRevenue = [
  { month: "T1", revenue: 450, orders: 120, profit: 85 },
  { month: "T2", revenue: 520, orders: 145, profit: 98 },
  { month: "T3", revenue: 480, orders: 132, profit: 91 },
  { month: "T4", revenue: 610, orders: 168, profit: 115 },
  { month: "T5", revenue: 550, orders: 156, profit: 104 },
  { month: "T6", revenue: 670, orders: 189, profit: 126 },
  { month: "T7", revenue: 720, orders: 203, profit: 135 },
];

const categoryRevenue = [
  { name: "Điện thoại", value: 450, color: "#3b82f6" },
  { name: "Laptop", value: 320, color: "#8b5cf6" },
  { name: "Tablet", value: 180, color: "#10b981" },
  { name: "Phụ kiện", value: 120, color: "#f59e0b" },
  { name: "Khác", value: 80, color: "#6b7280" },
];

const topProducts = [
  {
    name: "iPhone 15 Pro Max",
    revenue: 989700000,
    units: 30,
    trend: "up",
  },
  {
    name: "Samsung S24 Ultra",
    revenue: 869700000,
    units: 30,
    trend: "up",
  },
  {
    name: "MacBook Pro M3",
    revenue: 689850000,
    units: 15,
    trend: "down",
  },
  {
    name: "iPad Pro M2",
    revenue: 459800000,
    units: 20,
    trend: "up",
  },
  {
    name: "AirPods Pro 2",
    revenue: 194700000,
    units: 30,
    trend: "up",
  },
];

export function SalesReports() {
  const totalRevenue = monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = monthlyRevenue.reduce((sum, item) => sum + item.orders, 0);
  const totalProfit = monthlyRevenue.reduce((sum, item) => sum + item.profit, 0);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Báo cáo bán hàng</h2>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-600">Tổng doanh thu (7 tháng)</p>
          <p className="text-3xl font-bold mt-2">₫{totalRevenue}M</p>
          <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            +18.5% so với kỳ trước
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Tổng đơn hàng</p>
          <p className="text-3xl font-bold mt-2">{totalOrders}</p>
          <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            +12.3% so với kỳ trước
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Lợi nhuận</p>
          <p className="text-3xl font-bold mt-2">₫{totalProfit}M</p>
          <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            +15.7% so với kỳ trước
          </p>
        </Card>
      </div>

      {/* Revenue & Orders Chart */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Doanh thu & Đơn hàng theo tháng</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" name="Doanh thu (triệu)" />
            <Bar yAxisId="right" dataKey="orders" fill="#8b5cf6" name="Đơn hàng" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profit Trend */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Xu hướng lợi nhuận</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#10b981"
                strokeWidth={2}
                name="Lợi nhuận (triệu)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue by Category */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Doanh thu theo danh mục</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryRevenue}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryRevenue.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Top sản phẩm bán chạy</h3>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    Đã bán: {product.units} sản phẩm
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">₫{(product.revenue / 1000000).toFixed(1)}M</p>
                <div
                  className={`text-sm flex items-center gap-1 ${
                    product.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.trend === "up" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {product.trend === "up" ? "+12%" : "-5%"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
