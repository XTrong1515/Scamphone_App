import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronDown, Smartphone, Laptop, Tablet, Headphones, Home, Tv, Refrigerator } from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  subcategories: {
    id: string;
    name: string;
    items: string[];
  }[];
}

const categories: Category[] = [
  {
    id: "phone",
    name: "Điện thoại",
    icon: Smartphone,
    subcategories: [
      {
        id: "iphone",
        name: "iPhone",
        items: ["iPhone 15 Series", "iPhone 14 Series", "iPhone 13 Series", "iPhone SE"]
      },
      {
        id: "samsung",
        name: "Samsung",
        items: ["Galaxy S24 Series", "Galaxy A Series", "Galaxy Z Series", "Galaxy Note"]
      },
      {
        id: "xiaomi",
        name: "Xiaomi",
        items: ["Redmi Note Series", "Mi Series", "POCO Series"]
      },
      {
        id: "oppo",
        name: "OPPO",
        items: ["Find X Series", "Reno Series", "A Series"]
      }
    ]
  },
  {
    id: "laptop",
    name: "Laptop",
    icon: Laptop,
    subcategories: [
      {
        id: "gaming",
        name: "Gaming Laptop",
        items: ["ASUS ROG", "MSI Gaming", "Acer Predator", "HP Omen"]
      },
      {
        id: "ultrabook",
        name: "Ultrabook",
        items: ["MacBook", "Dell XPS", "HP Spectre", "ASUS ZenBook"]
      },
      {
        id: "workstation",
        name: "Workstation",
        items: ["ThinkPad", "Dell Precision", "HP ZBook"]
      }
    ]
  },
  {
    id: "tablet",
    name: "Tablet",
    icon: Tablet,
    subcategories: [
      {
        id: "ipad",
        name: "iPad",
        items: ["iPad Pro", "iPad Air", "iPad", "iPad Mini"]
      },
      {
        id: "android-tablet",
        name: "Android Tablet",
        items: ["Samsung Galaxy Tab", "Xiaomi Pad", "Huawei MatePad"]
      }
    ]
  },
  {
    id: "accessories",
    name: "Phụ kiện",
    icon: Headphones,
    subcategories: [
      {
        id: "audio",
        name: "Âm thanh",
        items: ["Tai nghe", "Loa Bluetooth", "Soundbar"]
      },
      {
        id: "charging",
        name: "Sạc & Cáp",
        items: ["Sạc nhanh", "Cáp Lightning", "Cáp USB-C", "Pin dự phòng"]
      },
      {
        id: "protection",
        name: "Bảo vệ",
        items: ["Ốp lưng", "Kính cường lực", "Balo laptop"]
      }
    ]
  },
  {
    id: "home-appliances",
    name: "Đồ gia dụng",
    icon: Home,
    subcategories: [
      {
        id: "kitchen",
        name: "Nhà bếp",
        items: ["Nồi cơm điện", "Máy xay sinh tố", "Lò vi sóng", "Bếp từ"]
      },
      {
        id: "cleaning",
        name: "Vệ sinh",
        items: ["Máy hút bụi", "Máy lau nhà", "Máy giặt mini"]
      },
      {
        id: "air",
        name: "Không khí",
        items: ["Quạt điện", "Máy lọc không khí", "Máy tạo ẩm"]
      }
    ]
  },
  {
    id: "tv",
    name: "TV",
    icon: Tv,
    subcategories: [
      {
        id: "smart-tv",
        name: "Smart TV",
        items: ["Samsung Smart TV", "LG Smart TV", "Sony Android TV", "TCL Google TV"]
      },
      {
        id: "size",
        name: "Theo kích thước",
        items: ["32 inch", "43 inch", "55 inch", "65 inch", "75 inch+"]
      },
      {
        id: "resolution",
        name: "Theo độ phân giải",
        items: ["4K Ultra HD", "Full HD", "8K"]
      }
    ]
  },
  {
    id: "refrigerator",
    name: "Tủ lạnh",
    icon: Refrigerator,
    subcategories: [
      {
        id: "type",
        name: "Loại tủ lạnh",
        items: ["Tủ lạnh 1 cửa", "Tủ lạnh 2 cửa", "Tủ lạnh side by side", "Tủ lạnh multi door"]
      },
      {
        id: "capacity",
        name: "Dung tích",
        items: ["Dưới 200L", "200L - 300L", "300L - 400L", "Trên 400L"]
      },
      {
        id: "brand",
        name: "Thương hiệu",
        items: ["Samsung", "LG", "Panasonic", "Toshiba", "Electrolux"]
      }
    ]
  }
];

interface CategoryDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onCategorySelect: (categoryId: string, subcategoryId?: string) => void;
}

export function CategoryDropdown({ isOpen, onClose, onCategorySelect }: CategoryDropdownProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40">
      {/* Backdrop */}
      <div 
        className="absolute inset-0"
        onClick={onClose}
      />
      
      {/* Dropdown content */}
      <div className="absolute top-16 left-0 right-0 bg-white shadow-lg border-t">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-7 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isHovered = hoveredCategory === category.id;
              
              return (
                <div
                  key={category.id}
                  className="space-y-4"
                  onMouseEnter={() => setHoveredCategory(category.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  {/* Category header */}
                  <div 
                    className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition-colors ${
                      isHovered ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      onCategorySelect(category.id);
                      onClose();
                    }}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  
                  {/* Subcategories */}
                  <div className="space-y-3">
                    {category.subcategories.map((subcategory) => (
                      <div key={subcategory.id} className="space-y-2">
                        <h4 
                          className="font-medium text-sm text-gray-700 hover:text-blue-600 cursor-pointer"
                          onClick={() => {
                            onCategorySelect(category.id, subcategory.id);
                            onClose();
                          }}
                        >
                          {subcategory.name}
                        </h4>
                        <ul className="space-y-1">
                          {subcategory.items.slice(0, 4).map((item, index) => (
                            <li key={index}>
                              <button 
                                className="text-sm text-gray-600 hover:text-blue-600 text-left"
                                onClick={() => {
                                  onCategorySelect(category.id, subcategory.id);
                                  onClose();
                                }}
                              >
                                {item}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  
                  {/* View all button */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={() => {
                      onCategorySelect(category.id);
                      onClose();
                    }}
                  >
                    Xem tất cả {category.name}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}