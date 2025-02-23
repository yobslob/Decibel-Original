import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Gear = ({ onClose }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.get('http://localhost:3000/api/v1/user/logout', {
                withCredentials: true,
            });
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-96">
                <div className="flex flex-col divide-y">
                    <button className="p-4 hover:bg-gray-100">Apps and Websites</button>
                    <button className="p-4 hover:bg-gray-100">QR Code</button>
                    <button className="p-4 hover:bg-gray-100">Notifications</button>
                    <button className="p-4 hover:bg-gray-100">Settings and Privacy</button>
                    <button className="p-4 hover:bg-gray-100">Login Activity</button>
                    <button className="p-4 hover:bg-gray-100 text-red-500" onClick={handleLogout}>
                        Log out
                    </button>
                    <button className="p-4 hover:bg-gray-100" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Gear;