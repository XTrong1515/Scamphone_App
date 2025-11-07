import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { useState, useEffect } from "react";
import { userService } from "../services/userService";
import { 
  User, 
  ShoppingBag, 
  Heart, 
  Settings, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Package,
  CreditCard,
  Bell,
  Shield
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

interface UserProfileDropdownProps {
  user: User;
  onClose: () => void;
  onLogout: () => void;
  onPageChange: (page: string) => void;
}

export function UserProfileDropdown({ user, onClose, onLogout, onPageChange }: UserProfileDropdownProps) {
  const [stats, setStats] = useState({ ordersCount: 0, points: 0, notificationsCount: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await userService.getUserStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load user stats:', error);
      }
    };
    loadStats();
  }, []);

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  const menuItems = [
    {
      icon: User,
      label: "Thông tin tài khoản",
      action: () => {
        onPageChange('profile');
        onClose();
      }
    },
    {
      icon: Package,
      label: "Đơn hàng của tôi",
      action: () => {
        onPageChange('orders');
        onClose();
      },
      badge: stats.ordersCount > 0 ? stats.ordersCount.toString() : undefined
    },
    {
      icon: Heart,
      label: "Sản phẩm yêu thích",
      action: () => {
        onPageChange('favorites');
        onClose();
      }
    },
    {
      icon: CreditCard,
      label: "Phương thức thanh toán",
      action: () => console.log("Payment methods")
    },
    {
      icon: Bell,
      label: "Thông báo",
      action: () => console.log("Notifications"),
      badge: stats.notificationsCount > 0 ? stats.notificationsCount.toString() : undefined
    },
    {
      icon: Settings,
      label: "Cài đặt",
      action: () => console.log("Settings")
    },
    {
      icon: Shield,
      label: "Admin Dashboard",
      action: () => {
        onPageChange("admin");
        onClose();
      },
      isAdmin: true
    },
    {
      icon: HelpCircle,
      label: "Trợ giúp & Hỗ trợ",
      action: () => console.log("Help")
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Dropdown */}
      <div className="absolute top-16 right-4 w-80">
        <Card className="shadow-lg">
          <CardContent className="p-0">
            {/* User Info */}
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{user.name}</h3>
                  <p className="text-sm text-gray-600 truncate">{user.email}</p>
                  <p className="text-sm text-gray-600">{user.phone}</p>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{stats.ordersCount}</div>
                  <div className="text-xs text-gray-600">Đơn hàng</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{stats.points}</div>
                  <div className="text-xs text-gray-600">Điểm tích lũy</div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={`w-full justify-between h-auto p-3 rounded-none ${
                    item.isAdmin 
                      ? "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50" 
                      : "hover:bg-gray-50"
                  }`}
                  onClick={item.action}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={`w-4 h-4 ${
                      item.isAdmin ? "text-blue-600" : "text-gray-600"
                    }`} />
                    <span className={`text-sm ${
                      item.isAdmin ? "font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" : ""
                    }`}>{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className={`w-4 h-4 ${
                      item.isAdmin ? "text-blue-400" : "text-gray-400"
                    }`} />
                  </div>
                </Button>
              ))}
            </div>

            <Separator />

            {/* Logout */}
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full justify-start h-auto p-3 rounded-none hover:bg-red-50 text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-3" />
                <span className="text-sm">Đăng xuất</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}