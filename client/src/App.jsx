import React, { useState } from 'react';
import Signup from './components/signup.jsx';
import Login from './components/login.jsx';

const App = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {isLogin ? (
          <Login onToggle={() => setIsLogin(false)} />
        ) : (
          <Signup onToggle={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

export default App;