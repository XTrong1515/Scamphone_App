import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { Loader2 } from "lucide-react";
import { userService } from "../../services/userService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Eye, EyeOff, Phone, ArrowLeft } from "lucide-react";

interface RegisterPageProps {
  onPageChange: (page: string) => void;
  onLogin: (user: any) => void;
}

export function RegisterPage({ onPageChange, onLogin }: RegisterPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const validateForm = () => {
    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }
    if (form.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
      setError('Email không hợp lệ');
      return false;
    }
    if (!/^[0-9]{10}$/.test(form.phone)) {
      setError('Số điện thoại không hợp lệ');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const { user } = await userService.register({
        name: form.fullName,
        email: form.email,
        password: form.password,
        phone: form.phone
      });
      
      onLogin(user);
      onPageChange('home');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      if (err.response?.status === 409) {
        setError('Email hoặc số điện thoại đã được sử dụng.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => onPageChange('home')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </Button>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg">
              <Phone className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-blue-600">ScamPhone</h1>
          </div>
          <p className="text-gray-600">Tạo tài khoản mới</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Đăng ký tài khoản</CardTitle>
            <CardDescription>
              Điền thông tin để tạo tài khoản mới
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ và tên *</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Nhập họ và tên"
                  value={form.fullName}
                  onChange={(e) => setForm({...form, fullName: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập email"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  value={form.phone}
                  onChange={(e) => setForm({...form, phone: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={form.password}
                    onChange={(e) => setForm({...form, password: e.target.value})}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" required />
                <span className="text-sm text-gray-600">
                  Tôi đồng ý với{" "}
                  <Button variant="link" className="px-0 text-blue-600 h-auto">
                    Điều khoản sử dụng
                  </Button>
                  {" "}và{" "}
                  <Button variant="link" className="px-0 text-blue-600 h-auto">
                    Chính sách bảo mật
                  </Button>
                </span>
              </div>
              
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang đăng ký...
                  </>
                ) : (
                  'Đăng ký tài khoản'
                )}
              </Button>
            </form>
            
            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <Button 
                  variant="link" 
                  className="px-0 text-blue-600 h-auto"
                  onClick={() => onPageChange('login')}
                >
                  Đăng nhập ngay
                </Button>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}