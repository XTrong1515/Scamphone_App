import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ShareDialog } from '../components/ShareDialog';
import { socialService } from '../services/socialService';

// Mock socialService
jest.mock('../services/socialService', () => ({
  socialService: {
    getShareLink: jest.fn()
  }
}));

describe('ShareDialog', () => {
  const mockProps = {
    isOpen: true,
    onClose: jest.fn(),
    productId: '123',
    title: 'Test Product',
    description: 'Test Description',
    image: 'test.jpg'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly when open', () => {
    render(<ShareDialog {...mockProps} />);
    expect(screen.getByText('Chia sẻ sản phẩm')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(<ShareDialog {...mockProps} isOpen={false} />);
    expect(screen.queryByText('Chia sẻ sản phẩm')).not.toBeInTheDocument();
  });

  it('should call getShareLink when opened', async () => {
    const mockShareUrl = 'http://test.com/share';
    (socialService.getShareLink as jest.Mock).mockResolvedValueOnce({ shareUrl: mockShareUrl });

    render(<ShareDialog {...mockProps} />);
    
    await waitFor(() => {
      expect(socialService.getShareLink).toHaveBeenCalledWith(mockProps.productId);
    });
  });

  it('should copy link to clipboard when copy button clicked', async () => {
    const mockShareUrl = 'http://test.com/share';
    (socialService.getShareLink as jest.Mock).mockResolvedValueOnce({ shareUrl: mockShareUrl });
    
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn()
      }
    });

    render(<ShareDialog {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue(mockShareUrl)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTitle('Copy link'));
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockShareUrl);
  });

  it('should handle error state', async () => {
    const error = new Error('Failed to get share link');
    (socialService.getShareLink as jest.Mock).mockRejectedValueOnce(error);

    render(<ShareDialog {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Không thể tạo link chia sẻ')).toBeInTheDocument();
    });
  });

  it('should reset state when closed', async () => {
    const mockShareUrl = 'http://test.com/share';
    (socialService.getShareLink as jest.Mock).mockResolvedValueOnce({ shareUrl: mockShareUrl });

    const { rerender } = render(<ShareDialog {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue(mockShareUrl)).toBeInTheDocument();
    });

    rerender(<ShareDialog {...mockProps} isOpen={false} />);
    rerender(<ShareDialog {...mockProps} isOpen={true} />);

    expect(screen.queryByDisplayValue(mockShareUrl)).not.toBeInTheDocument();
  });
});