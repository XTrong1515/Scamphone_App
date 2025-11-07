import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FavoriteButton } from '../components/FavoriteButton';
import { socialService } from '../services/socialService';

jest.mock('../services/socialService', () => ({
  socialService: {
    addToFavorites: jest.fn(),
    removeFromFavorites: jest.fn()
  }
}));

describe('FavoriteButton', () => {
  const mockProps = {
    productId: '123',
    isFavorited: false,
    onFavoriteChange: jest.fn(),
    disabled: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    render(<FavoriteButton {...mockProps} />);
    expect(screen.getByText('Yêu thích')).toBeInTheDocument();
  });

  it('should show favorited state', () => {
    render(<FavoriteButton {...mockProps} isFavorited={true} />);
    expect(screen.getByText('Đã thích')).toBeInTheDocument();
  });

  it('should be disabled when prop is true', () => {
    render(<FavoriteButton {...mockProps} disabled={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should call addToFavorites when clicking unfavorited button', async () => {
    (socialService.addToFavorites as jest.Mock).mockResolvedValueOnce(undefined);

    render(<FavoriteButton {...mockProps} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(socialService.addToFavorites).toHaveBeenCalledWith(mockProps.productId);
      expect(mockProps.onFavoriteChange).toHaveBeenCalledWith(true);
    });
  });

  it('should call removeFromFavorites when clicking favorited button', async () => {
    (socialService.removeFromFavorites as jest.Mock).mockResolvedValueOnce(undefined);

    render(<FavoriteButton {...mockProps} isFavorited={true} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(socialService.removeFromFavorites).toHaveBeenCalledWith(mockProps.productId);
      expect(mockProps.onFavoriteChange).toHaveBeenCalledWith(false);
    });
  });

  it('should show error message when API call fails', async () => {
    const error = new Error('Failed to add favorite');
    (socialService.addToFavorites as jest.Mock).mockRejectedValueOnce(error);

    render(<FavoriteButton {...mockProps} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Có lỗi xảy ra')).toBeInTheDocument();
    });
  });

  it('should show loading state while API call is pending', async () => {
    (socialService.addToFavorites as jest.Mock).mockImplementationOnce(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<FavoriteButton {...mockProps} />);
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByRole('button')).toBeDisabled();
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });
});