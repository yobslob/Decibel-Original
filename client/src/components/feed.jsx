import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/authContext.jsx';
import { authService } from '@/services/authService.jsx';
import Post from './ui/post.jsx';

const API_BASE_URL = 'http://localhost:3000/api/v1/post';

const Feed = () => { // Add userId prop
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const posts = await authService.getFeed();
            setPosts(posts);
        } catch (err) {
            setError('Failed to load posts');
            console.error('Error fetching posts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (postId, isLiked) => {
        try {
            const response = await authService.toggleLike(postId, isLiked);

            if (response.success) {
                setPosts(prevPosts => prevPosts.map(post => {
                    if (post._id === postId) {
                        const newLikes = isLiked
                            ? post.likes.filter(id => id !== user._id)
                            : [...post.likes, user._id];

                        return {
                            ...post,
                            likes: newLikes
                        };
                    }
                    return post;
                }));
            }
        } catch (err) {
            console.error('Error updating like:', err);
        }
    };

    const handleBookmark = async (postId) => {
        try {
            const response = await authService.toggleBookmark(postId);

            if (response.success) {
                setPosts(prevPosts => prevPosts.map(post => {
                    if (post._id === postId) {
                        return {
                            ...post,
                            isBookmarked: response.type === 'saved'
                        };
                    }
                    return post;
                }));
            }
        } catch (err) {
            console.error('Error updating bookmark:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 p-4">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 p-4">
            {posts.map(post => (
                <Post
                    key={post._id}
                    post={post}
                    userId={user?._id}
                    onLike={handleLike}
                    onBookmark={handleBookmark}
                />
            ))}
        </div>
    );
};

export default Feed;