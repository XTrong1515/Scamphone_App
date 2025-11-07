import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { searchService, SearchFilters } from '../services/searchService';

interface FilterSidebarProps {
  initialFilters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
}

export function FilterSidebar({ initialFilters, onFilterChange }: FilterSidebarProps) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [brands, setBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 100000000
  });
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number]>([
    initialFilters.priceRange?.min || 0,
    initialFilters.priceRange?.max || 100000000
  ]);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      const [brandsData, priceRangeData] = await Promise.all([
        searchService.getBrands(),
        searchService.getPriceRange()
      ]);
      setBrands(brandsData);
      setPriceRange(priceRangeData);
      setSelectedPriceRange([priceRangeData.min, priceRangeData.max]);
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    const updatedBrands = checked
      ? [...(filters.brand || []), brand]
      : (filters.brand || []).filter(b => b !== brand);

    const newFilters = {
      ...filters,
      brand: updatedBrands
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceRangeChange = (value: [number, number]) => {
    setSelectedPriceRange(value);
    const newFilters = {
      ...filters,
      priceRange: { min: value[0], max: value[1] }
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRatingChange = (rating: number) => {
    const newFilters = {
      ...filters,
      rating
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (sortBy: SearchFilters['sortBy']) => {
    const newFilters = {
      ...filters,
      sortBy
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const clearFilters = () => {
    const newFilters: SearchFilters = {
      page: 1,
      limit: initialFilters.limit
    };
    setFilters(newFilters);
    setSelectedPriceRange([priceRange.min, priceRange.max]);
    onFilterChange(newFilters);
  };

  return (
    <Card className="p-4 space-y-6">
      <div>
        <h3 className="font-medium mb-4">Sắp xếp theo</h3>
        <div className="space-y-2">
          {[
            { value: 'price-asc', label: 'Giá tăng dần' },
            { value: 'price-desc', label: 'Giá giảm dần' },
            { value: 'rating', label: 'Đánh giá cao' },
            { value: 'newest', label: 'Mới nhất' }
          ].map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                type="radio"
                id={option.value}
                name="sortBy"
                value={option.value}
                checked={filters.sortBy === option.value}
                onChange={() => handleSortChange(option.value as SearchFilters['sortBy'])}
                className="mr-2"
              />
              <Label htmlFor={option.value}>{option.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Khoảng giá</h3>
        <Slider
          value={selectedPriceRange}
          min={priceRange.min}
          max={priceRange.max}
          step={100000}
          onValueChange={handlePriceRangeChange}
          className="mb-4"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>{formatPrice(selectedPriceRange[0])}</span>
          <span>{formatPrice(selectedPriceRange[1])}</span>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Thương hiệu</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center">
              <Checkbox
                id={`brand-${brand}`}
                checked={(filters.brand || []).includes(brand)}
                onCheckedChange={(checked: boolean) => handleBrandChange(brand, checked)}
              />
              <Label htmlFor={`brand-${brand}`} className="ml-2">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Đánh giá</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center">
              <input
                type="radio"
                id={`rating-${rating}`}
                name="rating"
                value={rating}
                checked={filters.rating === rating}
                onChange={() => handleRatingChange(rating)}
                className="mr-2"
              />
              <Label htmlFor={`rating-${rating}`}>
                {rating} sao trở lên
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button 
        variant="outline" 
        className="w-full"
        onClick={clearFilters}
      >
        Xóa bộ lọc
      </Button>
    </Card>
  );
}