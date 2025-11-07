import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">ScamPhone</h3>
            </div>
            <p className="text-gray-400">
              ScamPhone - Hệ thống bán lẻ điện thoại di động, smartphone, máy tính bảng, 
              laptop và phụ kiện công nghệ hàng đầu Việt Nam.
            </p>
            <div className="flex space-x-4">
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                <Youtube className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Chăm sóc khách hàng</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Button variant="link" className="p-0 h-auto text-gray-400 hover:text-white">
                  Trung tâm trợ giúp
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-gray-400 hover:text-white">
                  Hướng dẫn mua hàng
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-gray-400 hover:text-white">
                  Chính sách đổi trả
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-gray-400 hover:text-white">
                  Chính sách bảo hành
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-gray-400 hover:text-white">
                  Chăm sóc khách hàng VIP
                </Button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Về ScamPhone</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Button variant="link" className="p-0 h-auto text-gray-400 hover:text-white">
                  Giới thiệu công ty
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-gray-400 hover:text-white">
                  Tuyển dụng
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-gray-400 hover:text-white">
                  Gửi góp ý, khiếu nại
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-gray-400 hover:text-white">
                  Tìm siêu thị (Hệ thống 7000+ cửa hàng)
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-gray-400 hover:text-white">
                  Xem bản mobile
                </Button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Liên hệ</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-white">Tư vấn mua hàng</p>
                  <p>1900 232 460 (8:00 - 22:00)</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-white">Hỗ trợ kỹ thuật</p>
                  <p>1900 232 464 (8:00 - 22:00)</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="font-medium text-white">Email</p>
                  <p>hotro@scamphone.vn</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-500 mt-1" />
                <div>
                  <p className="font-medium text-white">Trụ sở chính</p>
                  <p>128 Trần Quang Khải, P. Tân Định, Q.1, TP.HCM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-400 text-sm">
            <p>© 2024 ScamPhone. Tất cả các quyền được bảo lưu.</p>
          </div>
          <div className="flex space-x-6 text-sm text-gray-400">
            <Button variant="link" className="p-0 h-auto text-gray-400 hover:text-white">
              Điều khoản sử dụng
            </Button>
            <Button variant="link" className="p-0 h-auto text-gray-400 hover:text-white">
              Chính sách bảo mật
            </Button>
            <Button variant="link" className="p-0 h-auto text-gray-400 hover:text-white">
              Chính sách cookie
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}