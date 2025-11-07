import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartDropdown } from '../components/CartDropdown';

const mockCartItems = [
  {
    id: '1',
    name: 'Test Product 1',
    price: 999.99,
    quantity: 2,
    image: 'test-image-1.jpg'
  },
  {
    id: '2', 
    name: 'Test Product 2',
    price: 499.99,
    quantity: 1,
    image: 'test-image-2.jpg'
  }
];

describe('CartDropdown Component', () => {
  const mockProps = {
    onUpdateCart: jest.fn(),
    onClose: jest.fn(),
    onPageChange: jest.fn()
  };

  const renderCartDropdown = () => {
    return render(
      <BrowserRouter>
        <CartDropdown 
          cartItems={mockCartItems}
          onUpdateCart={mockProps.onUpdateCart}
          onClose={mockProps.onClose}
          onPageChange={mockProps.onPageChange}
        />
      </BrowserRouter>
    );
  };

  it('renders cart items correctly', () => {
    renderCartDropdown();
    
    mockCartItems.forEach(item => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
      expect(screen.getByText(`$${item.price}`)).toBeInTheDocument();
      expect(screen.getByText(`Quantity: ${item.quantity}`)).toBeInTheDocument();
    });
  });

  it('calculates total price correctly', () => {
    renderCartDropdown();
    const totalPrice = mockCartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    expect(screen.getByText(`Total: $${totalPrice.toFixed(2)}`)).toBeInTheDocument();
  });

  it('has working checkout button', () => {
    renderCartDropdown();
    const checkoutButton = screen.getByRole('button', { name: /checkout/i });
    
    expect(checkoutButton).toBeInTheDocument();
    fireEvent.click(checkoutButton);
    expect(mockProps.onPageChange).toHaveBeenCalledWith('checkout');
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('calls onUpdateCart when quantity is changed', () => {
    renderCartDropdown();
    const incrementButton = screen.getByLabelText(`Increase quantity for ${mockCartItems[0].name}`);
    
    fireEvent.click(incrementButton);
    expect(mockProps.onUpdateCart).toHaveBeenCalledWith(mockCartItems[0].id, mockCartItems[0].quantity + 1);
  });

  it('calls onClose when close button is clicked', () => {
    renderCartDropdown();
    const closeButton = screen.getByLabelText('Close cart');
    
    fireEvent.click(closeButton);
    expect(mockProps.onClose).toHaveBeenCalled();
  });
});