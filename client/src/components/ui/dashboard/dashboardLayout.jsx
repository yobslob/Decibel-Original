// components/dashboard/DashboardLayout.jsx
import React from 'react';
import TabBar from './TabBar';

const DashboardLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100">
            <main className="pb-20"> {/* Add padding bottom to account for tab bar */}
                {children}
            </main>
            <TabBar />
        </div>
    );
};

export default DashboardLayout;