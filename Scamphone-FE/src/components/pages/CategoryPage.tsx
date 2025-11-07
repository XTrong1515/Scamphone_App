import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";
import { Checkbox } from "../ui/checkbox";
import { ProductCard } from "../ProductCard";
import { ArrowLeft, Filter, Grid, List, SlidersHorizontal } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  discount?: number;
  isHot?: boolean;
  brand?: string;
  category?: string;
}

import { useEffect } from "react";
import { SearchBar } from "../SearchBar";
import { FilterSidebar } from "../FilterSidebar";
import { Pagination } from "../ui/pagination";
import { Loader2 } from "lucide-react";
import { searchService, SearchFilters, SearchResult } from "../../services/searchService";

interface CategoryPageProps {
  categoryId: string;
  subcategoryId?: string;
  onPageChange: (page: string) => void;
  onAddToCart: (product: any) => void;
  onProductClick: (product: any) => void;
}

export function CategoryPage({ 
  categoryId, 
  subcategoryId, 
  onPageChange, 
  onAddToCart, 
  onProductClick 
}: CategoryPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Mock products data - in real app this would come from API
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "iPhone 15 Pro Max 256GB",
      price: 29990000,
      originalPrice: 32990000,
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400",
      rating: 4.8,
      discount: 9,
      isHot: true,
      brand: "Apple",
      category: "phone"
    },
    {
      id: "2", 
      name: "Samsung Galaxy S24 Ultra 512GB",
      price: 27990000,
      originalPrice: 30990000,
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400",
      rating: 4.7,
      discount: 10,
      brand: "Samsung",
      category: "phone"
    },
    {
      id: "3",
      name: "MacBook Pro 14 M3 Pro",
      price: 52990000,
      originalPrice: 55990000,
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400",
      rating: 4.9,
      discount: 5,
      brand: "Apple",
      category: "laptop"
    },
    {
      id: "4",
      name: "Dell XPS 13 Plus",
      price: 35990000,
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
      rating: 4.6,
      brand: "Dell",
      category: "laptop"
    }
  ];

  const categoryNames: { [key: string]: string } = {
    'phone': 'Điện thoại',
    'laptop': 'Laptop',
    'tablet': 'Tablet',
    'accessories': 'Phụ kiện',
    'home-appliances': 'Đồ gia dụng',
    'tv': 'TV',
    'refrigerator': 'Tủ lạnh'
  };

  const brands = ['Apple', 'Samsung', 'Xiaomi', 'OPPO', 'Vivo', 'Dell', 'HP', 'ASUS', 'Acer', 'Lenovo'];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = product.category === categoryId;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand || '');
    
    return matchesCategory && matchesPrice && matchesBrand;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => onPageChange('home')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </Button>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{categoryNames[categoryId]}</span>
        </div>

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{categoryNames[categoryId]}</h1>
          <p className="text-gray-600">Tìm thấy {sortedProducts.length} sản phẩm</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <div className={`w-64 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Bộ lọc</h3>
                
                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Khoảng giá</h4>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={50000000}
                    step={1000000}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <h4 className="font-medium mb-3">Thương hiệu</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {brands.map(brand => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={brand}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={() => toggleBrand(brand)}
                        />
                        <label htmlFor={brand} className="text-sm cursor-pointer">
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Bộ lọc
                </Button>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Sắp xếp:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Phổ biến</SelectItem>
                      <SelectItem value="price-asc">Giá thấp đến cao</SelectItem>
                      <SelectItem value="price-desc">Giá cao đến thấp</SelectItem>
                      <SelectItem value="rating">Đánh giá cao</SelectItem>
                      <SelectItem value="name">Tên A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            {sortedProducts.length > 0 ? (
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }>
                {sortedProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    onProductClick={onProductClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-gray-600">
                  Hãy thử điều chỉnh bộ lọc để tìm kiếm sản phẩm phù hợp
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}