import React, { useState } from 'react';
import Input from './ui/input';
import Button from './ui/button';

const Login = ({ onToggle }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const response = await fetch('http://localhost:3000/api/v1/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include' // Important for cookie handling
            });

            const data = await response.json();

            if (!response.ok) {
                setErrors({ general: data.message });
                return;
            }

            // Handle successful login
            alert(data.message); // You might want to replace this with a better UI notification
            // You can store user data in context/state management here
            window.location.href = '/dashboard'; // Or use your routing solution
        } catch (error) {
            setErrors({ general: 'Failed to connect to the server. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
                <p className="mt-2 text-sm text-gray-600">Please sign in to your account</p>
            </div>

            {errors.general && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {errors.general}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Email address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                />

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                            Remember me
                        </label>
                    </div>

                    <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        Forgot password?
                    </a>
                </div>

                <Button loading={loading}>Sign in</Button>
            </form>

            <div className="text-center">
                <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button
                        onClick={onToggle}
                        className="font-medium text-blue-600 hover:text-blue-500"
                    >
                        Sign up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;