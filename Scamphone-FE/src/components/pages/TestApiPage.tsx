import { useState } from 'react';
import { userService, User } from '../../services/userService';
import { productService, Product } from '../../services/productService';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Alert } from '../ui/alert';

interface TestPageProps {
  onPageChange?: (page: string) => void;
}

export function TestApiPage({ onPageChange }: TestPageProps) {
  const [loginStatus, setLoginStatus] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);

  // Test login
  const testLogin = async () => {
    try {
      setLoginStatus('Attempting login...');
      const result = await userService.login({
        email: 'test@example.com',
        password: 'testpassword'
      });
      setLoginStatus(`Login successful! User: ${result.user.name}`);
    } catch (err: any) {
      setLoginStatus(`Login failed: ${err.message}`);
    }
  };

  // Test product fetching
  const fetchProducts = async () => {
    try {
      const { products } = await productService.getAllProducts();
      setProducts(products);
      setError('');
    } catch (err: any) {
      setError(`Failed to fetch products: ${err.message}`);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Test Login</h2>
        <Button onClick={testLogin} className="mb-2">
          Test Login
        </Button>
        <div className="text-sm">
          Status: {loginStatus || 'Not attempted'}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Test Products</h2>
        <Button onClick={fetchProducts} className="mb-2">
          Fetch Products
        </Button>
        {error && (
          <div className="text-red-500 mb-2">{error}</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product._id} className="p-4">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-gray-600">${product.price.toFixed(2)}</p>
              <p className="text-sm">{product.description}</p>
              {product.stock !== undefined && (
                <p className="text-sm text-gray-500 mt-2">Stock: {product.stock}</p>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}