import React from 'react';
import { Heart, Bookmark, MessageCircle } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar.jsx';
import Button from '../ui/Button.jsx';
import { useAuth } from '../../context/authContext.jsx';
import { Link } from 'react-router-dom';

const Post = ({ post, onLike, onBookmark }) => {
    const { user } = useAuth();

    // Add null checks
    const isLiked = post?.likes?.includes(user?._id) || false;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Return null or loading state if post data isn't available
    if (!post || !post.author) {
        return null;
    }

    const handleLikeClick = () => {
        if (!user) return;
        onLike(post._id, isLiked);
    };

    const handleBookmarkClick = () => {
        if (!user) return;
        onBookmark(post._id);
    };

    return (
        <Card className="w-full bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center space-x-4 p-4">
                <Link to={`/profile/${post.author._id}`} className="hover:opacity-80">
                    <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-gray-200">
                        <AvatarImage
                            src={post.author?.profilePicture}
                            alt={post.author?.username}
                            className="object-cover"
                        />
                        <AvatarFallback className="bg-gray-100 text-gray-600">
                            {post.author?.username?.[0]?.toUpperCase() || '?'}
                        </AvatarFallback>
                    </Avatar>
                </Link>
                <div className="flex-1">
                    <Link
                        to={`/profile/${post.author._id}`}
                        className="font-semibold hover:underline"
                    >
                        {post.author.username}
                    </Link>
                    <p className="text-sm text-gray-500">
                        {formatDate(post.createdAt)}
                    </p>
                </div>
            </CardHeader>

            <CardContent className="p-4">
                <p className="text-gray-800 whitespace-pre-wrap break-words">
                    {post.caption}
                </p>
                {post.image && (
                    <div className="mt-4 rounded-lg overflow-hidden">
                        <img
                            src={post.image}
                            alt="Post content"
                            className="w-full object-cover max-h-96 hover:opacity-95 transition-opacity"
                            loading="lazy"
                        />
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex justify-between items-center p-4 border-t">
                <div className="flex space-x-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLikeClick}
                        className={`flex items-center space-x-2 hover:bg-red-50 
                            ${isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
                    >
                        <Heart
                            className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`}
                        />
                        <span className="font-medium">
                            {post.likes?.length > 0 && post.likes.length}
                        </span>
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                    >
                        <MessageCircle className="h-5 w-5" />
                        <span className="font-medium">
                            {post.comments?.length > 0 && post.comments.length}
                        </span>
                    </Button>
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBookmarkClick}
                    className={`hover:bg-blue-50 
                        ${post.isBookmarked ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}
                >
                    <Bookmark
                        className={`h-5 w-5 ${post.isBookmarked ? 'fill-current' : ''}`}
                    />
                </Button>
            </CardFooter>
        </Card>
    );
};

export default Post;