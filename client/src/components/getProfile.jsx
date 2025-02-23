import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import axios from 'axios';
import UserData from './ui/userData.jsx';
import UserPosts from './ui/userPosts.jsx';
import Gear from './ui/gear.jsx';
import { useNavigate, useParams } from 'react-router-dom';

const GetProfile = () => {
    const [userData, setUserData] = useState(null);
    const [posts, setPosts] = useState([]);
    const [showGear, setShowGear] = useState(false);
    const [error, setError] = useState(null);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                if (!id) {
                    navigate('/login');
                    return;
                }

                // Fetch user profile
                const userResponse = await fetch(`http://localhost:3000/api/v1/user/${id}`, {
                    credentials: 'include',
                });

                const userData = await userResponse.json();

                if (!userResponse.ok) {
                    throw new Error(userData.message || 'Failed to fetch profile');
                }

                if (userData.success) {
                    setUserData(userData.user);
                    setIsOwnProfile(true); // Set based on your authentication logic
                }

                // Fetch user posts
                const postsResponse = await fetch(`http://localhost:3000/api/v1/post/user/${id}`, {
                    credentials: 'include',
                });

                const postsData = await postsResponse.json();

                if (postsResponse.ok && postsData.success) {
                    setPosts(postsData.posts);
                } else {
                    console.error('Failed to fetch posts:', postsData.message);
                }
            } catch (error) {
                console.error('Error:', error);
                setError(error.message);
                if (error.message.includes('unauthorized')) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [id, navigate]);

    if (error) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-red-500 p-4 text-center">
                <p>{error}</p>
                <button
                    onClick={() => navigate('/login')}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Go to Login
                </button>
            </div>
        </div>
    );

    if (!userData && loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto">
            {isOwnProfile && (
                <div className="flex justify-end p-4">
                    <button
                        onClick={() => setShowGear(true)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <Settings className="w-6 h-6" />
                    </button>
                </div>
            )}

            <UserData userData={userData} isOwnProfile={isOwnProfile} />
            <UserPosts posts={posts} loading={loading} />

            {showGear && <Gear onClose={() => setShowGear(false)} />}
        </div>
    );
};

export default GetProfile;