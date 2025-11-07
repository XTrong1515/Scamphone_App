import { useState } from "react";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FolderTree, 
  BarChart3, 
  Tag,
  Menu,
  X
} from "lucide-react";
import { DashboardOverview } from "../admin/DashboardOverview";
import { OrderManagement } from "../admin/OrderManagement";
import { InventoryManagement } from "../admin/InventoryManagement";
import { ProductManagement } from "../admin/ProductManagement";
import { CategoryManagement } from "../admin/CategoryManagement";
import { SalesReports } from "../admin/SalesReports";
import { UserManagement } from "../admin/UserManagement";
import { PromotionManagement } from "../admin/PromotionManagement";

interface AdminDashboardProps {
  onPageChange: (page: string) => void;
}

type AdminSection = 
  | "overview"
  | "orders"
  | "inventory"
  | "products"
  | "categories"
  | "reports"
  | "users"
  | "promotions";

export function AdminDashboard({ onPageChange }: AdminDashboardProps) {
  const [currentSection, setCurrentSection] = useState<AdminSection>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: "overview", label: "Tổng quan", icon: LayoutDashboard },
    { id: "orders", label: "Quản lý đơn hàng", icon: ShoppingCart },
    { id: "inventory", label: "Quản lý kho hàng", icon: Package },
    { id: "products", label: "Quản lý sản phẩm", icon: Package },
    { id: "categories", label: "Quản lý danh mục", icon: FolderTree },
    { id: "reports", label: "Báo cáo bán hàng", icon: BarChart3 },
    { id: "users", label: "Quản lý người dùng", icon: Users },
    { id: "promotions", label: "Khuyến mãi", icon: Tag },
  ];

  const renderSection = () => {
    switch (currentSection) {
      case "overview":
        return <DashboardOverview />;
      case "orders":
        return <OrderManagement />;
      case "inventory":
        return <InventoryManagement />;
      case "products":
        return <ProductManagement />;
      case "categories":
        return <CategoryManagement />;
      case "reports":
        return <SalesReports />;
      case "users":
        return <UserManagement />;
      case "promotions":
        return <PromotionManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ScamPhone Admin
            </h1>
          </div>
          <button
            onClick={() => onPageChange("home")}
            className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Về trang chủ
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-[73px] left-0 h-[calc(100vh-73px)] bg-white border-r border-gray-200 
            transition-transform duration-300 z-30
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            w-64
          `}
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentSection(item.id as AdminSection);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${
                      currentSection === item.id
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
