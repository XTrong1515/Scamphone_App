import { useState, useEffect } from "react";
import { ShoppingCart, Package, Users, TrendingUp, Loader2 } from "lucide-react";
import { Card } from "../ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { adminService } from "../../services/adminService";

const statsData = [
  {
    title: "Tổng doanh thu",
    value: "₫127,450,000",
    change: "+12.5%",
    icon: TrendingUp,
    color: "from-blue-600 to-blue-400",
  },
  {
    title: "Đơn hàng mới",
    value: "156",
    change: "+8.2%",
    icon: ShoppingCart,
    color: "from-purple-600 to-purple-400",
  },
  {
    title: "Sản phẩm",
    value: "1,234",
    change: "+3.1%",
    icon: Package,
    color: "from-green-600 to-green-400",
  },
  {
    title: "Khách hàng",
    value: "8,492",
    change: "+15.3%",
    icon: Users,
    color: "from-orange-600 to-orange-400",
  },
];

const revenueData = [
  { month: "T1", revenue: 45000000 },
  { month: "T2", revenue: 52000000 },
  { month: "T3", revenue: 48000000 },
  { month: "T4", revenue: 61000000 },
  { month: "T5", revenue: 55000000 },
  { month: "T6", revenue: 67000000 },
  { month: "T7", revenue: 72000000 },
];

const orderData = [
  { month: "T1", orders: 120 },
  { month: "T2", orders: 145 },
  { month: "T3", orders: 132 },
  { month: "T4", orders: 168 },
  { month: "T5", orders: 156 },
  { month: "T6", orders: 189 },
  { month: "T7", orders: 203 },
];

export function DashboardOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      title: "Tổng doanh thu",
      value: "₫0", // TODO: Calculate from orders
      change: "+12.5%",
      icon: TrendingUp,
      color: "from-blue-600 to-blue-400",
    },
    {
      title: "Đơn hàng",
      value: stats.totalOrders.toString(),
      change: "+8.2%",
      icon: ShoppingCart,
      color: "from-purple-600 to-purple-400",
    },
    {
      title: "Sản phẩm",
      value: stats.totalProducts.toString(),
      change: "+3.1%",
      icon: Package,
      color: "from-green-600 to-green-400",
    },
    {
      title: "Người dùng",
      value: stats.totalUsers.toString(),
      change: "+15.3%",
      icon: Users,
      color: "from-orange-600 to-orange-400",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Tổng quan Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change} so với tháng trước</p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Doanh thu theo tháng</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => `₫${value.toLocaleString()}`}
              />
              <Bar dataKey="revenue" fill="url(#colorRevenue)" />
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Orders Chart */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Đơn hàng theo tháng</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={orderData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: "#8b5cf6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Đơn hàng gần đây</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Mã đơn</th>
                <th className="text-left py-3 px-4">Khách hàng</th>
                <th className="text-left py-3 px-4">Sản phẩm</th>
                <th className="text-left py-3 px-4">Tổng tiền</th>
                <th className="text-left py-3 px-4">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  id: "DH001",
                  customer: "Nguyễn Văn A",
                  product: "iPhone 15 Pro Max",
                  total: "₫32,990,000",
                  status: "Đã giao",
                  statusColor: "bg-green-100 text-green-700",
                },
                {
                  id: "DH002",
                  customer: "Trần Thị B",
                  product: "Samsung Galaxy S24 Ultra",
                  total: "₫28,990,000",
                  status: "Đang giao",
                  statusColor: "bg-blue-100 text-blue-700",
                },
                {
                  id: "DH003",
                  customer: "Lê Văn C",
                  product: "MacBook Pro M3",
                  total: "₫45,990,000",
                  status: "Chờ xử lý",
                  statusColor: "bg-yellow-100 text-yellow-700",
                },
              ].map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{order.id}</td>
                  <td className="py-3 px-4">{order.customer}</td>
                  <td className="py-3 px-4">{order.product}</td>
                  <td className="py-3 px-4 font-medium">{order.total}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
