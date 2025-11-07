import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CommentSection } from '../components/CommentSection';
import { socialService } from '../services/socialService';

jest.mock('../services/socialService', () => ({
  socialService: {
    getProductComments: jest.fn(),
    createComment: jest.fn(),
    replyToComment: jest.fn(),
    likeComment: jest.fn()
  }
}));

const mockComments = [
  {
    _id: '1',
    user: {
      _id: 'user1',
      name: 'User 1'
    },
    content: 'Test comment 1',
    likes: 0,
    likedBy: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    replies: []
  },
  {
    _id: '2',
    user: {
      _id: 'user2',
      name: 'User 2'
    },
    content: 'Test comment 2',
    likes: 1,
    likedBy: ['user1'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    replies: []
  }
];

describe('CommentSection', () => {
  const mockProps = {
    productId: '123',
    user: {
      _id: 'user1',
      name: 'Test User'
    },
    onShowAuthModal: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (socialService.getProductComments as jest.Mock).mockResolvedValue(mockComments);
  });

  it('should render loading state initially', () => {
    render(<CommentSection {...mockProps} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should load and display comments', async () => {
    render(<CommentSection {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('Test comment 1')).toBeInTheDocument();
      expect(screen.getByText('Test comment 2')).toBeInTheDocument();
    });
  });

  it('should handle new comment submission', async () => {
    const newComment = {
      _id: '3',
      user: mockProps.user,
      content: 'New comment',
      likes: 0,
      likedBy: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      replies: []
    };

    (socialService.createComment as jest.Mock).mockResolvedValueOnce(newComment);

    render(<CommentSection {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Viết bình luận của bạn...')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Viết bình luận của bạn...');
    fireEvent.change(input, { target: { value: 'New comment' } });
    
    const submitButton = screen.getByText('Gửi bình luận');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(socialService.createComment).toHaveBeenCalledWith(mockProps.productId, 'New comment');
      expect(screen.getByText('New comment')).toBeInTheDocument();
    });
  });

  it('should handle reply to comment', async () => {
    const reply = {
      _id: '4',
      user: mockProps.user,
      content: 'Test reply',
      likes: 0,
      likedBy: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    (socialService.replyToComment as jest.Mock).mockResolvedValueOnce(reply);

    render(<CommentSection {...mockProps} />);

    await waitFor(() => {
      expect(screen.getAllByText('Trả lời')[0]).toBeInTheDocument();
    });

    const replyButton = screen.getAllByText('Trả lời')[0];
    fireEvent.click(replyButton);

    const replyInput = screen.getByPlaceholderText('Viết trả lời của bạn...');
    fireEvent.change(replyInput, { target: { value: 'Test reply' } });

    const submitReplyButton = screen.getByText('Trả lời', { selector: 'button' });
    fireEvent.click(submitReplyButton);

    await waitFor(() => {
      expect(socialService.replyToComment).toHaveBeenCalledWith(
        mockProps.productId,
        mockComments[0]._id,
        'Test reply'
      );
      expect(screen.getByText('Test reply')).toBeInTheDocument();
    });
  });

  it('should show auth modal when trying to comment without user', () => {
    render(<CommentSection {...mockProps} user={null} />);
    
    const input = screen.getByPlaceholderText('Đăng nhập để bình luận');
    expect(input).toBeDisabled();

    const commentButton = screen.getByText('Gửi bình luận');
    fireEvent.click(commentButton);

    expect(mockProps.onShowAuthModal).toHaveBeenCalled();
  });

  it('should handle error states', async () => {
    (socialService.getProductComments as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to load comments')
    );

    render(<CommentSection {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('Không thể tải bình luận')).toBeInTheDocument();
    });
  });

  it('should handle like/unlike comment', async () => {
    const updatedComment = {
      ...mockComments[0],
      likes: 1,
      likedBy: [mockProps.user._id]
    };

    (socialService.likeComment as jest.Mock).mockResolvedValueOnce(updatedComment);

    render(<CommentSection {...mockProps} />);

    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /0/i })[0]).toBeInTheDocument();
    });

    const likeButton = screen.getAllByRole('button', { name: /0/i })[0];
    fireEvent.click(likeButton);

    await waitFor(() => {
      expect(socialService.likeComment).toHaveBeenCalledWith(
        mockProps.productId,
        mockComments[0]._id
      );
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });
});