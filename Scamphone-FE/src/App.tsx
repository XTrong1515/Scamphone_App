import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./components/pages/HomePage";
import { LoginPage } from "./components/pages/LoginPage";
import { RegisterPage } from "./components/pages/RegisterPage";
import { CartPage } from "./components/pages/CartPage";
import { ProductDetailPage } from "./components/pages/ProductDetailPage";
import { CategoryPage } from "./components/pages/CategoryPage";
import { AdminDashboard } from "./components/pages/AdminDashboard";
import { ProfilePage } from "./components/pages/ProfilePage";
import { OrdersPage } from "./components/pages/OrdersPage";
import { FavoritesPage } from "./components/pages/FavoritesPage";
import { AuthModal } from "./components/AuthModal";
import { CartDropdown } from "./components/CartDropdown";
import { UserProfileDropdown } from "./components/UserProfileDropdown";
import { ScrollToTop } from "./components/ScrollToTop";
import { TestApiPage } from "./components/pages/TestApiPage";
import { ForgotPasswordForm } from "./components/ForgotPasswordForm";
import { ResetPasswordPage } from "./components/pages/ResetPasswordPage";
import { userService } from "./services/userService";

interface Product {
  id: string;
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  discount?: number;
  isHot?: boolean;
  description?: string;
  specifications?: { [key: string]: string };
  images?: string[];
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  discount?: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<{categoryId: string, subcategoryId?: string} | undefined>(undefined);
  const [resetToken, setResetToken] = useState<string>('');
  
  // Modal/Dropdown states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Load user from token on app mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await userService.getCurrentUser();
          const userObj = {
            id: userData._id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone || '',
            avatar: '',
            role: userData.role
          };
          setUser(userObj);
          
          // Load cart for this user
          const userCartKey = `cart_${userData._id}`;
          const savedCart = localStorage.getItem(userCartKey);
          if (savedCart) {
            setCartItems(JSON.parse(savedCart));
          }
        } catch (error) {
          console.error('Failed to load user:', error);
          localStorage.removeItem('token');
        }
      }
    };
    loadUser();
  }, []);

  // Save cart to localStorage when it changes (per user)
  useEffect(() => {
    if (user) {
      const userCartKey = `cart_${user.id}`;
      localStorage.setItem(userCartKey, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const handleAddToCart = (product: Product) => {
    setCartItems(prevItems => {
      const prodId = product.id ?? product._id;
      const existingItem = prevItems.find(item => item.id === prodId);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === prodId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: prodId,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          quantity: 1,
          discount: product.discount,
        };
        return [...prevItems, newItem];
      }
    });
  };

  const handleUpdateCart = (items: CartItem[]) => {
    setCartItems(items);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    // Load cart for this user
    const userCartKey = `cart_${userData.id}`;
    const savedCart = localStorage.getItem(userCartKey);
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    } else {
      setCartItems([]); // Clear cart if no saved cart
    }
    // Check if there's a redirect after login
    if (currentPage === 'cart') {
      setShowAuthModal(false);
    }
  };

  const handleLogout = () => {
    setUser(undefined);
    setCartItems([]); // Clear cart on logout
  };

  const handleCategorySelect = (categoryId: string, subcategoryId?: string) => {
    setSelectedCategory({ categoryId, subcategoryId });
    setCurrentPage('category');
  };

  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            onAddToCart={handleAddToCart} 
            onProductClick={handleProductClick}
            onCategorySelect={handleCategorySelect}
          />
        );
      case 'login':
        return (
          <LoginPage 
            onPageChange={setCurrentPage} 
            onLogin={handleLogin}
          />
        );
      case 'register':
        return (
          <RegisterPage 
            onPageChange={setCurrentPage} 
            onLogin={handleLogin}
          />
        );
      case 'cart':
        return (
          <CartPage
            cartItems={cartItems}
            user={user}
            onUpdateCart={handleUpdateCart}
            onPageChange={setCurrentPage}
          />
        );
      case 'product-detail':
        return selectedProduct ? (
          <ProductDetailPage
            product={selectedProduct}
            user={user}
            onPageChange={setCurrentPage}
            onAddToCart={handleAddToCart}
          />
        ) : (
          <HomePage 
            onAddToCart={handleAddToCart} 
            onProductClick={handleProductClick}
          />
        );
      case 'category':
        return selectedCategory ? (
          <CategoryPage
            categoryId={selectedCategory.categoryId}
            subcategoryId={selectedCategory.subcategoryId}
            onPageChange={setCurrentPage}
            onAddToCart={handleAddToCart}
            onProductClick={handleProductClick}
          />
        ) : (
          <HomePage 
            onAddToCart={handleAddToCart} 
            onProductClick={handleProductClick}
          />
        );
      case 'admin':
        return <AdminDashboard onPageChange={setCurrentPage} />;
      case 'profile':
        return <ProfilePage onPageChange={setCurrentPage} />;
      case 'orders':
        return <OrdersPage onPageChange={setCurrentPage} />;
      case 'favorites':
        return <FavoritesPage onPageChange={setCurrentPage} onAddToCart={handleAddToCart} />;
      case 'test-api':
        return <TestApiPage />;
      case 'forgot-password':
        return <ForgotPasswordForm 
          onPageChange={setCurrentPage} 
          onTokenGenerated={setResetToken}
        />;
      case 'reset-password':
        return <ResetPasswordPage token={resetToken} />;
      default:
        return (
          <HomePage 
            onAddToCart={handleAddToCart} 
            onProductClick={handleProductClick}
          />
        );
    }
  };

  // Check if current page should show full layout or standalone
  const isStandalonePage = currentPage === 'login' || currentPage === 'register' || currentPage === 'admin' || currentPage === 'profile' || currentPage === 'orders' || currentPage === 'favorites' || currentPage === 'forgot-password' || currentPage === 'reset-password';

  if (isStandalonePage) {
    // Render standalone pages without header/footer
    return (
      <div className="min-h-screen">
        {renderCurrentPage()}
      </div>
    );
  }

  // Render pages with full layout
  return (
    <div className="min-h-screen flex flex-col">
      <Header
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        cartItemCount={getTotalCartItems()}
        user={user}
        onShowAuthModal={() => setShowAuthModal(true)}
        onShowCartDropdown={() => setShowCartDropdown(true)}
        onShowUserMenu={() => setShowUserMenu(true)}
        onCategorySelect={handleCategorySelect}
      />
      
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      
      <Footer />

      {/* Modals and Dropdowns */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onPageChange={setCurrentPage}
      />

      {showCartDropdown && (
        <CartDropdown
          cartItems={cartItems}
          onUpdateCart={(items: any) => handleUpdateCart(items)}
          onClose={() => setShowCartDropdown(false)}
          onPageChange={setCurrentPage}
        />
      )}

      {showUserMenu && user && (
        <UserProfileDropdown
          user={user}
          onClose={() => setShowUserMenu(false)}
          onLogout={handleLogout}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}
