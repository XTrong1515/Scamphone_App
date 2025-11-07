import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Check } from 'lucide-react';
import { passwordResetService } from '../../services/passwordResetService';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Token không hợp lệ');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await passwordResetService.resetPassword(token, newPassword);
      setSuccess(true);
      // Chuyển về trang đăng nhập sau 3 giây
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="p-6 w-full max-w-md">
        {success ? (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Check className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-green-600">
              Đặt lại mật khẩu thành công!
            </h2>
            <p className="text-gray-600">
              Bạn sẽ được chuyển về trang đăng nhập trong vài giây...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Đặt lại mật khẩu</h2>
              <p className="text-gray-600">
                Vui lòng nhập mật khẩu mới của bạn
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setNewPassword(e.target.value)
                }
                placeholder="Nhập mật khẩu mới"
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setConfirmPassword(e.target.value)
                }
                placeholder="Nhập lại mật khẩu mới"
                required
                minLength={6}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Đặt lại mật khẩu'
              )}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}