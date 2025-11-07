import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar } from './ui/avatar';
import { Alert, AlertDescription } from './ui/alert';
import { ThumbsUp, MessageCircle, MoreVertical, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { socialService, ProductComment } from '../services/socialService';

interface CommentSectionProps {
  productId: string;
  user: any | null;
  onShowAuthModal?: () => void;
}

export function CommentSection({ productId, user, onShowAuthModal }: CommentSectionProps) {
  const [comments, setComments] = useState<ProductComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [productId]);

  useEffect(() => {
    // Reset state when user changes
    setNewComment('');
    setReplyTo(null);
    setReplyContent('');
    setError('');
  }, [user?._id]);

  const loadComments = async () => {
    if (!productId) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const data = await socialService.getProductComments(productId);
      setComments(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải bình luận');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onShowAuthModal?.();
      return;
    }

    const content = newComment.trim();
    if (!content) return;

    setIsSubmitting(true);
    setError('');

    try {
      const comment = await socialService.createComment(productId, content);
      setComments(prevComments => [comment, ...prevComments]);
      setNewComment('');
      
      // Scroll to new comment
      setTimeout(() => {
        document.getElementById(`comment-${comment._id}`)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể gửi bình luận');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (commentId: string) => {
    if (!user) {
      onShowAuthModal?.();
      return;
    }

    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    try {
      const reply = await socialService.replyToComment(
        productId,
        commentId,
        replyContent
      );
      
      // Update comments with new reply
      const updatedComments = comments.map(comment => {
        if (comment._id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), reply]
          };
        }
        return comment;
      });

      setComments(updatedComments);
      setReplyTo(null);
      setReplyContent('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể gửi trả lời');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      onShowAuthModal?.();
      return;
    }

    try {
      const updatedComment = await socialService.likeComment(productId, commentId);
      const updateCommentInList = (list: ProductComment[]): ProductComment[] => {
        return list.map(comment => {
          if (comment._id === commentId) {
            return updatedComment;
          }
          if (comment.replies?.length) {
            return {
              ...comment,
              replies: updateCommentInList(comment.replies)
            };
          }
          return comment;
        });
      };

      setComments(prevComments => updateCommentInList(prevComments));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể thích bình luận');
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      <Card className="p-4">
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <Textarea
            placeholder={user ? "Viết bình luận của bạn..." : "Đăng nhập để bình luận"}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!user || isSubmitting}
            className="min-h-[100px]"
          />
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!user || isSubmitting || !newComment.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                'Gửi bình luận'
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <Card 
            key={comment._id} 
            id={`comment-${comment._id}`}
            className="p-4 transition-all duration-300 hover:shadow-md"
          >
            {/* Main Comment */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    {comment.user.avatar ? (
                      <img
                        src={comment.user.avatar}
                        alt={comment.user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-medium">
                        {comment.user.name.charAt(0)}
                      </div>
                    )}
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{comment.user.name}</h4>
                    <p className="text-sm text-gray-500">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                                          <DropdownMenuItem onSelect={() => {
                        if (user) {
                          socialService.reportProduct(productId, "Nội dung không phù hợp")
                            .catch(err => setError(err.message));
                        } else {
                          onShowAuthModal?.();
                        }
                      }}>
                        Báo cáo
                      </DropdownMenuItem>
                    {user && user._id === comment.user._id && (
                      <DropdownMenuItem className="text-red-600">
                        Xóa
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="text-gray-700">{comment.content}</p>

              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${
                    comment.likedBy?.includes(user?._id || '') 
                      ? 'text-blue-600' 
                      : 'text-gray-500 hover:text-blue-600'
                  }`}
                  onClick={() => handleLikeComment(comment._id)}
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span>{comment.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-blue-600"
                  onClick={() => setReplyTo(comment._id)}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Trả lời
                </Button>
              </div>

              {/* Reply Form */}
              {replyTo === comment._id && (
                <div className="ml-12 space-y-3">
                  <Textarea
                    placeholder="Viết trả lời của bạn..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setReplyTo(null)}
                    >
                      Hủy
                    </Button>
                    <Button
                      size="sm"
                      disabled={isSubmitting || !replyContent.trim()}
                      onClick={() => handleSubmitReply(comment._id)}
                    >
                      {isSubmitting ? 'Đang gửi...' : 'Trả lời'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-12 space-y-4 border-l-2 pl-4">
                  {comment.replies.map((reply) => (
                    <div key={reply._id} className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          {reply.user.avatar ? (
                            <img
                              src={reply.user.avatar}
                              alt={reply.user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-medium">
                              {reply.user.name.charAt(0)}
                            </div>
                          )}
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{reply.user.name}</h4>
                          <p className="text-sm text-gray-500">
                            {formatDate(reply.createdAt)}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700">{reply.content}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-blue-600"
                        onClick={() => handleLikeComment(reply._id)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {reply.likes}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}