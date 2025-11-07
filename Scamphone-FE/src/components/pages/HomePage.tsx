import { useState, useEffect } from "react";
import { ProductCard } from "../ProductCard";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Loader2 } from "lucide-react";
import { productService, Product } from "../../services/productService";

interface HomePageProps {
  onAddToCart: (product: any) => void;
  onProductClick: (product: any) => void;
}

export function HomePage({ onAddToCart, onProductClick }: HomePageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts({ 
        limit: 12,
        page: 1 
      });
      setProducts(response.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const hotProducts = products.filter(p => p.isHot).slice(0, 4);
  const featuredProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50">
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          {/* Hero Banner */}
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-4">
                    ScamPhone - Điện thoại & Công nghệ
                  </h1>
                  <p className="text-xl mb-6">
                    Uy tín - Chất lượng - Giá tốt nhất thị trường
                  </p>
                  <div className="flex space-x-4">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                      Khám phá ngay
                    </Button>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                      Ưu đãi hôm nay
                    </Button>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1675953935267-e039f13ddd79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbW9iaWxlJTIwcGhvbmV8ZW58MXx8fHwxNzU4ODI0MzM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Hero Phone"
                    className="w-80 h-80 object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Flash Sale */}
          {hotProducts.length > 0 && (
            <section className="py-12 bg-red-50">
              <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center space-x-2 bg-red-500 text-white px-6 py-2 rounded-full mb-4">
                    <span className="text-lg font-bold">⚡ FLASH SALE</span>
                    <span>Còn lại: 12:34:56</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Siêu ưu đãi trong ngày</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {hotProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={{
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        originalPrice: product.originalPrice,
                        image: product.image,
                        rating: product.rating || 5,
                        discount: product.discount,
                        isHot: product.isHot
                      }}
                      onAddToCart={onAddToCart}
                      onProductClick={onProductClick}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Categories */}
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">Danh mục sản phẩm</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    📱
                  </div>
                  <h3 className="font-medium">Điện thoại</h3>
                </div>
                <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    💻
                  </div>
                  <h3 className="font-medium">Laptop</h3>
                </div>
                <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    📱
                  </div>
                  <h3 className="font-medium">Tablet</h3>
                </div>
                <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    🎧
                  </div>
                  <h3 className="font-medium">Phụ kiện</h3>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Products */}
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">Sản phẩm nổi bật</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={{
                      id: product._id,
                      name: product.name,
                      price: product.price,
                      originalPrice: product.originalPrice,
                      image: product.image,
                      rating: product.rating || 5,
                      discount: product.discount,
                      isHot: product.isHot
                    }}
                    onAddToCart={onAddToCart}
                    onProductClick={onProductClick}
                  />
                ))}
              </div>
              <div className="text-center mt-8">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Xem tất cả sản phẩm
                </Button>
              </div>
            </div>
          </section>

          {/* Newsletter */}
          <section className="py-12 bg-blue-600 text-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">Đăng ký nhận tin</h2>
              <p className="text-lg mb-6">Nhận thông tin khuyến mãi và sản phẩm mới nhất</p>
              <div className="max-w-md mx-auto flex space-x-2">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="flex-1 px-4 py-2 rounded-lg text-gray-900"
                />
                <Button className="bg-white text-blue-600 hover:bg-gray-100">
                  Đăng ký
                </Button>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}