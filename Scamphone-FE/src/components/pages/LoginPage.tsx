import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription } from "../ui/alert";
import { Loader2 } from "lucide-react";
import { userService } from "../../services/userService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Eye, EyeOff, Phone, Mail, Facebook, ArrowLeft } from "lucide-react";

interface LoginPageProps {
  onPageChange: (page: string) => void;
  onLogin: (user: any) => void;
}

export function LoginPage({ onPageChange, onLogin }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const { user } = await userService.login({
        email: form.email,
        password: form.password
      });
      
      onLogin(user);
      onPageChange('home');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
      if (err.response?.status === 404) {
        setError('Tài khoản không tồn tại. Vui lòng đăng ký.');
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
          <p className="text-gray-600">Đăng nhập vào tài khoản của bạn</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Đăng nhập</CardTitle>
            <CardDescription>
              Nhập thông tin để đăng nhập vào tài khoản
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email hoặc số điện thoại</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Nhập email hoặc số điện thoại"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
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
              
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-gray-600">Ghi nhớ đăng nhập</span>
                </label>
                <Button 
                  variant="link" 
                  className="px-0 text-blue-600"
                  onClick={() => onPageChange('forgot-password')}
                >
                  Quên mật khẩu?
                </Button>
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
                    Đang đăng nhập...
                  </>
                ) : (
                  'Đăng nhập'
                )}
              </Button>
            </form>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Hoặc đăng nhập với
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                <Facebook className="w-4 h-4 mr-2" />
                Facebook
              </Button>
              <Button variant="outline" className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Google
              </Button>
            </div>
            
            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <Button 
                  variant="link" 
                  className="px-0 text-blue-600 h-auto"
                  onClick={() => onPageChange('register')}
                >
                  Đăng ký ngay
                </Button>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}