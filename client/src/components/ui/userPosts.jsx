import React from 'react';

const UserPosts = ({ posts, loading }) => {
    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!posts?.length) {
        return (
            <div className="text-center p-8 text-gray-500">
                No posts yet
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-1">
            {posts.map((post) => (
                <div key={post._id} className="relative aspect-square group">
                    <img
                        src={post.image || "/api/placeholder/300/300"}
                        alt={post.caption || "Post"}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <div className="flex gap-8">
                            <div className="flex items-center gap-2">
                                <span>❤️</span>
                                <span>{post.likes?.length || 0}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>💬</span>
                                <span>{post.comments?.length || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
export default UserPosts;