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
      <DialogContent className="sm:max-w-md p-0 gap-0">
        <DialogTitle className="sr-only">Đăng nhập tài khoản</DialogTitle>
        <DialogDescription className="sr-only">
          Vui lòng chọn phương thức đăng nhập hoặc tạo tài khoản mới
        </DialogDescription>
        
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 z-10"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
          
          <div className="p-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg mr-3">
                <Phone className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-blue-600">ScamPhone</h2>
            </div>
            
            <h3 className="text-xl font-semibold mb-2">Vui lòng đăng nhập tài khoản Smember</h3>
            <p className="text-gray-600 mb-8">để xem ưu đãi và thanh toán dễ dàng hơn.</p>
            
            <div className="space-y-4">
              <Button
                onClick={handleRegisterClick}
                className="w-full bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50"
                size="lg"
              >
                Đăng ký
              </Button>
              
              <Button
                onClick={handleLoginClick}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                Đăng nhập
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}