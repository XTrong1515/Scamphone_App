import { useState, useEffect } from "react";
import { Heart, Home, Trash2, ShoppingCart, Search } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface FavoriteProduct {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  discount?: number;
  stock_quantity: number;
}

export function FavoritesPage({ onPageChange, onAddToCart }: { 
  onPageChange: (page: string) => void;
  onAddToCart: (product: any) => void;
}) {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  };

  const removeFavorite = (productId: string) => {
    const updated = favorites.filter(p => p._id !== productId);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const handleAddToCart = (product: FavoriteProduct) => {
    onAddToCart(product);
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const filteredFavorites = favorites.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => onPageChange('home')}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Về trang chủ
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <Heart className="w-7 h-7 text-pink-600 fill-pink-600" />
            Sản phẩm yêu thích
          </h1>
          <div className="w-[120px]"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search */}
        <Card className="p-4 mb-6 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Tìm kiếm sản phẩm yêu thích..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Stats */}
        <div className="mb-6 p-4 bg-white rounded-lg border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-pink-600 fill-pink-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng số sản phẩm yêu thích</p>
              <p className="text-2xl font-bold text-pink-600">{favorites.length}</p>
            </div>
          </div>
          {favorites.length > 0 && (
            <Button
              variant="outline"
              className="text-red-600 hover:bg-red-50"
              onClick={() => {
                if (confirm(`Xóa tất cả ${favorites.length} sản phẩm khỏi danh sách yêu thích?`)) {
                  setFavorites([]);
                  localStorage.setItem('favorites', JSON.stringify([]));
                }
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa tất cả
            </Button>
          )}
        </div>

        {/* Products Grid */}
        {filteredFavorites.length === 0 ? (
          <Card className="p-12 text-center bg-white">
            <Heart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm ? "Không tìm thấy sản phẩm" : "Chưa có sản phẩm yêu thích"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? "Thử từ khóa khác để tìm kiếm" 
                : "Khám phá và thêm những sản phẩm yêu thích của bạn"}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => onPageChange('home')}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white"
              >
                <Heart className="w-4 h-4 mr-2" />
                Khám phá sản phẩm
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFavorites.map((product) => (
              <Card key={product._id} className="overflow-hidden hover:shadow-xl transition-all group bg-white">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.discount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      -{product.discount}%
                    </div>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm hover:bg-red-50 border-red-200"
                    onClick={() => removeFavorite(product._id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[48px]">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-bold text-blue-600">
                      ₫{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ₫{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:opacity-90"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock_quantity === 0}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {product.stock_quantity > 0 ? "Thêm vào giỏ" : "Hết hàng"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
