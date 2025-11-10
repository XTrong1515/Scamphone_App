import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Phone, X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPageChange: (page: string) => void;
}

export function AuthModal({ isOpen, onClose, onPageChange }: AuthModalProps) {
  const handleLoginClick = () => {
    onPageChange('login');
    onClose();
  };

  const handleRegisterClick = () => {
    onPageChange('register');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 w-[95vw] sm:w-full">
        <DialogTitle className="sr-only">Đăng nhập tài khoản</DialogTitle>
        <DialogDescription className="sr-only">
          Vui lòng chọn phương thức đăng nhập hoặc tạo tài khoản mới
        </DialogDescription>
        
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 z-10 hover:bg-gray-100 rounded-full"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
          
          <div className="p-6 sm:p-8 text-center">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 sm:p-3 rounded-lg mr-2 sm:mr-3 shadow-lg">
                <Phone className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ScamPhone
              </h2>
            </div>
            
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              Vui lòng đăng nhập tài khoản Smember
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
              để xem ưu đãi và thanh toán dễ dàng hơn.
            </p>
            
            <div className="space-y-3 sm:space-y-4">
              <Button
                onClick={handleRegisterClick}
                className="w-full bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 shadow-md hover:shadow-lg transition-all text-sm sm:text-base py-5 sm:py-6"
                size="lg"
              >
                ✨ Đăng ký ngay
              </Button>
              
              <Button
                onClick={handleLoginClick}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all text-sm sm:text-base py-5 sm:py-6"
                size="lg"
              >
                🔐 Đăng nhập
              </Button>
            </div>
            
            <div className="mt-6 sm:mt-8 text-xs sm:text-sm text-gray-500">
              <p>Bằng việc đăng nhập, bạn đồng ý với</p>
              <p className="text-blue-600 mt-1">Điều khoản sử dụng & Chính sách bảo mật</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}