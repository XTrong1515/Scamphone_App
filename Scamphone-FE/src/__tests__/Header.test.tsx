import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '../components/Header';

const mockProps = {
  isAuthenticated: false,
  cartItemCount: 2,
  onSearch: jest.fn(),
  currentPage: 'home' as const,
  onPageChange: jest.fn(),
  onLoginClick: jest.fn(),
  user: undefined as {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
  } | undefined,
  onShowAuthModal: jest.fn(),
  onShowCartDropdown: jest.fn(),
  onShowUserMenu: jest.fn(),
  onCategorySelect: jest.fn(),
};

const renderHeader = () => {
  const { currentPage, onPageChange, cartItemCount, ...rest } = mockProps;
  return render(
    <BrowserRouter>
      <Header
        currentPage={currentPage}
        onPageChange={onPageChange}
        cartItemCount={cartItemCount}
        {...rest}
      />
    </BrowserRouter>
  );
};

describe('Header', () => {
  it('renders logo and navigation links', () => {
    renderHeader();
    
    // Check if logo exists
    expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
    
    // Check navigation links
    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/products/i)).toBeInTheDocument();
    expect(screen.getByText(/categories/i)).toBeInTheDocument();
  });

  it('renders search bar', () => {
    renderHeader();
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it('renders shopping cart icon', () => {
    renderHeader();
    expect(screen.getByText(/Giỏ hàng/i)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // Cart item count
  });

  it('shows login button when not authenticated', () => {
    renderHeader();
    const loginButton = screen.getByText(/Đăng nhập/i);
    
    expect(loginButton).toBeInTheDocument();
    fireEvent.click(loginButton);
    expect(mockProps.onShowAuthModal).toHaveBeenCalled();
  });

  it('shows user menu when authenticated', () => {
    mockProps.user = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      avatar: '/avatar.jpg'
    };
    renderHeader();
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    const userButton = screen.getByText('Test User').parentElement;
    if (userButton) {
      fireEvent.click(userButton);
    }
    expect(mockProps.onShowUserMenu).toHaveBeenCalled();
  });

  it('navigates to home page when logo is clicked', () => {
    renderHeader();
    const logo = screen.getByText(/ScamPhone/i).parentElement?.parentElement;
    if (logo) {
      fireEvent.click(logo);
    }
    expect(mockProps.onPageChange).toHaveBeenCalledWith('home');
  });

  it('handles cart dropdown', () => {
    renderHeader();
    const cartButton = screen.getByText(/Giỏ hàng/i).parentElement;
    if (cartButton) {
      fireEvent.click(cartButton);
    }
    expect(mockProps.onShowCartDropdown).toHaveBeenCalled();
  });

  it('handles category selection', () => {
    renderHeader();
    const phoneCategory = screen.getByText(/Điện thoại/i);
    
    fireEvent.click(phoneCategory);
    expect(mockProps.onCategorySelect).toHaveBeenCalledWith('phone');
  });
});