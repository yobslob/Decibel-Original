import React, { useState } from 'react';
import Input from './ui/input';
import Button from './ui/button';

const Signup = ({ onToggle }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const response = await fetch('http://localhost:3000/api/v1/user/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                setErrors({ general: data.message });
                return;
            }

            // Handle successful signup
            alert(data.message);
            onToggle(); // Switch to login form
        } catch (error) {
            setErrors({ general: 'Failed to connect to the server. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">Create account</h2>
                <p className="mt-2 text-sm text-gray-600">Get started with your free account</p>
            </div>

            {errors.general && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {errors.general}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    error={errors.username}
                />
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

                <Button loading={loading}>Create account</Button>
            </form>

            <div className="text-center">
                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <button
                        onClick={onToggle}
                        className="font-medium text-blue-600 hover:text-blue-500"
                    >
                        Log in
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Signup;