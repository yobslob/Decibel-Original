import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/auth/signup.jsx';
import Login from './components/auth/login.jsx';
import GetProfile from './components/getProfile.jsx';
import Feed from './components/feed.jsx';
import DashboardLayout from './components/ui/dashboard/dashboardLayout.jsx';
import { AuthProvider, useAuth } from './context/authContext.jsx';
import { ProtectedRoute } from './components/auth/protectedRoute.jsx';

// Create a wrapper for auth routes
const AuthWrapper = ({ children }) => {
  const { user } = useAuth();

  // If user is authenticated, redirect to feed
  if (user) {
    return <Navigate to="/feed" />;
  }

  return children;
};

// Create a wrapper for protected routes with dashboard layout
const ProtectedDashboardRoute = ({ children }) => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
};

const App = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route
              path="/"
              element={
                <AuthWrapper>
                  <div className="sm:mx-auto sm:w-full sm:max-w-md py-12 px-6 lg:px-8">
                    {isLogin ? (
                      <Login onToggle={() => setIsLogin(false)} />
                    ) : (
                      <Signup onToggle={() => setIsLogin(true)} />
                    )}
                  </div>
                </AuthWrapper>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <ProtectedDashboardRoute>
                  <GetProfile />
                </ProtectedDashboardRoute>
              }
            />
            <Route
              path="/feed"
              element={
                <ProtectedDashboardRoute>
                  <Feed />
                </ProtectedDashboardRoute>
              }
            />
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <Navigate to="/feed" />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;