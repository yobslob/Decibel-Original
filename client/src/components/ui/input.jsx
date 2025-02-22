import React from 'react';

const Input = ({ label, type = "text", error, ...props }) => (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${error ? 'border-red-500' : 'border-gray-300'
                }`}
            {...props}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
);

export default Input;