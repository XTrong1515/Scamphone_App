import { useState, useEffect } from "react";
import { ProductCard } from "../ProductCard";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Loader2, RefreshCw, ShoppingBag } from "lucide-react";
import { productService, Product } from "../../services/productService";
import { categoryService, Category } from "../../services/categoryService";

interface HomePageProps {
  onAddToCart: (product: any) => void;
  onProductClick: (product: any) => void;
  onCategorySelect?: (categoryId: string) => void;
}

export function HomePage({ onAddToCart, onProductClick, onCategorySelect }: HomePageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProducts();
    loadCategories();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadProducts(true);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProducts = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      
      const response = await productService.getAllProducts({ 
        limit: 20,
        page: 1 
      });
      setProducts(response.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadProducts(true);
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
          <section className="relative bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-10 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
              <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
              <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div className="space-y-6">
                  <Badge className="bg-blue-600 text-white px-4 py-1.5 text-sm font-medium">
                    🎉 Ưu đãi hấp dẫn
                  </Badge>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    Điện thoại & Công nghệ
                    <span className="block text-blue-600 mt-2">Giá tốt nhất</span>
                  </h1>
                  
                  <p className="text-lg md:text-xl text-gray-600 max-w-xl">
                    Hàng chính hãng 100% - Bảo hành toàn quốc - Trả góp 0% lãi suất
                  </p>
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      size="lg" 
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-6 text-base shadow-lg hover:shadow-xl transition-all"
                    >
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      Mua ngay
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-8 py-6 text-base"
                    >
                      Khám phá ngay
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-6 pt-8">
                    <div className="text-center lg:text-left">
                      <div className="text-3xl md:text-4xl font-bold text-blue-600">5000+</div>
                      <div className="text-sm text-gray-600 mt-1">Sản phẩm</div>
                    </div>
                    <div className="text-center lg:text-left">
                      <div className="text-3xl md:text-4xl font-bold text-blue-600">100%</div>
                      <div className="text-sm text-gray-600 mt-1">Chính hãng</div>
                    </div>
                    <div className="text-center lg:text-left">
                      <div className="text-3xl md:text-4xl font-bold text-blue-600">24/7</div>
                      <div className="text-sm text-gray-600 mt-1">Hỗ trợ</div>
                    </div>
                  </div>
                </div>

                {/* Right Image */}
                <div className="relative hidden lg:block">
                  <div className="relative z-10">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1675953935267-e039f13ddd79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbW9iaWxlJTIwcGhvbmV8ZW58MXx8fHwxNzU4ODI0MzM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Latest Smartphones"
                      className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-full h-full bg-blue-200 rounded-2xl -z-10"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Flash Sale */}
          {hotProducts.length > 0 && (
            <section className="py-12 md:py-16 bg-gray-50">
              <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                  <div className="mb-4 sm:mb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 text-base font-bold">
                        ⚡ FLASH SALE
                      </Badge>
                      <div className="text-gray-700 font-medium">
                        Kết thúc trong: <span className="text-red-600 font-bold">12:34:56</span>
                      </div>
                    </div>
                    <p className="text-gray-600">Giảm giá sốc - Số lượng có hạn!</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
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
                        isHot: product.isHot,
                        status: product.status,
                        stock: product.stock_quantity
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
          <section className="py-12 md:py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Danh mục sản phẩm</h2>
                <p className="text-gray-600 text-lg">Khám phá đa dạng sản phẩm công nghệ hàng đầu</p>
              </div>
              {categories.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                  {categories.map((category) => (
                    <div 
                      key={category._id}
                      className="group bg-gradient-to-br from-gray-50 to-white text-center p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-200"
                      onClick={() => onCategorySelect?.(category._id)}
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <span className="text-4xl">📦</span>
                      </div>
                      <h3 className="font-semibold text-base text-gray-800 group-hover:text-blue-600 transition-colors">{category.name}</h3>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                  {[
                    { icon: "📱", name: "Điện thoại", color: "from-blue-500 to-blue-600" },
                    { icon: "💻", name: "Laptop", color: "from-purple-500 to-purple-600" },
                    { icon: "⌚", name: "Smartwatch", color: "from-green-500 to-green-600" },
                    { icon: "🎧", name: "Phụ kiện", color: "from-orange-500 to-orange-600" }
                  ].map((cat, idx) => (
                    <div 
                      key={idx}
                      className="group bg-gradient-to-br from-gray-50 to-white text-center p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-200"
                    >
                      <div className={`w-20 h-20 bg-gradient-to-br ${cat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                        <span className="text-4xl">{cat.icon}</span>
                      </div>
                      <h3 className="font-semibold text-base text-gray-800 group-hover:text-blue-600 transition-colors">{cat.name}</h3>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Featured Products */}
          <section className="py-12 md:py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                <div className="mb-4 sm:mb-0">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Sản phẩm nổi bật</h2>
                  <p className="text-gray-600 text-lg">Được khách hàng yêu thích nhất</p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="hidden sm:flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  {refreshing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang tải...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span>Làm mới</span>
                    </>
                  )}
                </Button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
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
                      isHot: product.isHot,
                      status: product.status,
                      stock: product.stock_quantity
                    }}
                    onAddToCart={onAddToCart}
                    onProductClick={onProductClick}
                  />
                ))}
              </div>
              
              <div className="text-center mt-10">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all">
                  Xem tất cả sản phẩm
                  <span className="ml-2">→</span>
                </Button>
              </div>
            </div>
          </section>

          {/* Newsletter */}
          <section className="py-16 md:py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
            </div>
            
            <div className="container mx-auto px-4 text-center relative z-10">
              <div className="max-w-3xl mx-auto">
                <Badge className="bg-white text-blue-600 px-5 py-2 text-sm font-bold mb-6">
                  🎁 Ưu đãi đặc biệt
                </Badge>
                
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  Đăng ký nhận tin khuyến mãi
                </h2>
                <p className="text-lg md:text-xl mb-8 text-blue-100">
                  Nhận ngay <span className="text-yellow-300 font-bold">voucher 100.000đ</span> cho đơn hàng đầu tiên
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mb-8">
                  <input
                    type="email"
                    placeholder="Nhập email của bạn..."
                    className="flex-1 px-6 py-4 rounded-lg text-gray-900 text-base focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg"
                  />
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-4 text-base shadow-lg">
                    Đăng ký ngay
                  </Button>
                </div>
                
                <div className="flex flex-wrap items-center justify-center gap-8 text-base">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-300 text-xl">✓</span>
                    <span>Miễn phí ship đơn 500K+</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-300 text-xl">✓</span>
                    <span>Ưu đãi độc quyền</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-300 text-xl">✓</span>
                    <span>Quà tặng hấp dẫn</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}