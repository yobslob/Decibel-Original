// components/layout/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className="bg-white shadow">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                    <div className="flex">
                        <Link to="/feed" className="flex items-center">
                            <span className="text-xl font-bold text-indigo-600">SocialApp</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link
                            to={`/profile/${user?._id}`}
                            className="text-gray-700 hover:text-gray-900"
                        >
                            <div className="flex items-center space-x-2">
                                {user?.profilePicture ? (
                                    <img
                                        src={user.profilePicture}
                                        alt={user.username}
                                        className="h-8 w-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-sm font-medium text-gray-600">
                                            {user?.username?.[0]?.toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <span>{user?.username}</span>
                            </div>
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}