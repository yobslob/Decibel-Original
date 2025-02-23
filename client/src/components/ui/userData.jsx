import React from 'react';

// UserData Component
const UserData = ({ userData }) => {
    const getPronouns = (gender) => {
        if (gender.toLowerCase() === 'male') {
            return 'he/him';
        }
        else if (gender.toLowerCase() === 'female') {
            return 'she/her';
        } else {
            return '';
        }
    };

    return (
        <div className="flex items-start gap-8 p-8">
            <img
                src={userData.profilePicture || "https://res.cloudinary.com/djctcdudc/image/upload/v1740306656/default_user_mncift.jpg"}
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover"
            />

            <div className="flex flex-col gap-4">
                <div className="flex gap-8 items-center">
                    <div className="flex gap-8 text-center">
                        <div>
                            <div className="font-bold text-xl">{userData.posts?.length || 0}</div>
                            <div className="text-gray-600">posts</div>
                        </div>
                        <div>
                            <div className="font-bold text-xl">{userData.followers?.length || 0}</div>
                            <div className="text-gray-600">followers</div>
                        </div>
                        <div>
                            <div className="font-bold text-xl">{userData.following?.length || 0}</div>
                            <div className="text-gray-600">following</div>
                        </div>
                    </div>
                </div>

                <div className="text-xl font-bold">{userData.username}</div>
                <div className="text-gray-600">{getPronouns(userData.gender || '')}</div>
                <div className="max-w-md">{userData.bio || ''}</div>

                <div className="flex gap-4">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                        Edit Profile
                    </button>
                    <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition">
                        Saved Posts
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserData;