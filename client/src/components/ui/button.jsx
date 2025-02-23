import React from 'react';
import { ChevronRight, Loader2 } from 'lucide-react';

const Button = ({ children, loading, ...props }) => (
  <button
    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
    disabled={loading}
    {...props}
  >
    {loading ? (
      <Loader2 className="h-4 w-4 animate-spin" />
    ) : (
      <>
        {children}
        <ChevronRight className="ml-2 h-4 w-4" />
      </>
    )}
  </button>
);

export default Button;