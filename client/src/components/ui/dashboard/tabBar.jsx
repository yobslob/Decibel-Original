// components/dashboard/TabBar.jsx
import React from 'react';
import { Home, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/authContext.jsx';

const TabBar = () => {
    const location = useLocation();
    const { user } = useAuth();

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t">
            <div className="max-w-md mx-auto px-6 py-2">
                <div className="flex justify-around items-center">
                    <Link
                        to="/feed"
                        className={`flex flex-col items-center p-2 ${location.pathname === '/feed'
                            ? 'text-blue-500'
                            : 'text-gray-500 hover:text-blue-500'
                            }`}
                    >
                        <Home className="h-6 w-6" />
                        <span className="text-xs mt-1">Home</span>
                    </Link>

                    <Link
                        to={`/profile/${user?._id}`}
                        className={`flex flex-col items-center p-2 ${location.pathname.startsWith('/profile')
                            ? 'text-blue-500'
                            : 'text-gray-500 hover:text-blue-500'
                            }`}
                    >
                        <User className="h-6 w-6" />
                        <span className="text-xs mt-1">Profile</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TabBar;