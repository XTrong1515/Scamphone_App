import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 999.99,
  description: 'Test description',
  image: 'test-image.jpg',
  category: 'Test Category',
  stock: 10,
  rating: 4.5
};

describe('ProductCard Component', () => {
  const renderProductCard = () => {
    return render(
      <BrowserRouter>
        <ProductCard product={mockProduct} onAddToCart={jest.fn()} onProductClick={jest.fn()} />
      </BrowserRouter>
    );
  };

  it('renders product information correctly', () => {
    renderProductCard();
    
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct.price}`)).toBeInTheDocument();
    expect(screen.getByAltText(mockProduct.name)).toBeInTheDocument();
  });

  it('has working add to cart button', () => {
    renderProductCard();
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    
    expect(addToCartButton).toBeInTheDocument();
    fireEvent.click(addToCartButton);
    // Add assertions for cart functionality here
  });

  it('links to product detail page', () => {
    renderProductCard();
    const productLink = screen.getByRole('link');
    expect(productLink).toHaveAttribute('href', `/product/${mockProduct.id}`);
  });
});