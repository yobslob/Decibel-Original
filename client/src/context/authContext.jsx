// context/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext(null);

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null
};

function authReducer(state, action) {
    switch (action.type) {
        case 'AUTH_START':
            return {
                ...state,
                loading: true,
                error: null
            };
        case 'AUTH_SUCCESS':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                loading: false,
                error: null
            };
        case 'AUTH_FAILURE':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                loading: false,
                error: action.payload
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                loading: false,
                error: null
            };
        default:
            return state;
    }
}

export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    async function checkAuthStatus() {
        try {
            const response = await fetch('http://localhost:3000/api/v1/user/profile', {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                dispatch({ type: 'AUTH_SUCCESS', payload: data.user });
            } else {
                dispatch({ type: 'AUTH_FAILURE', payload: null });
            }
        } catch (error) {
            dispatch({ type: 'AUTH_FAILURE', payload: null });
        }
    }

    const value = {
        ...state,
        login: async (credentials) => {
            dispatch({ type: 'AUTH_START' });
            try {
                const response = await fetch('http://localhost:3000/api/v1/user/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(credentials)
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message);
                }

                dispatch({ type: 'AUTH_SUCCESS', payload: data.user });
                return data;
            } catch (error) {
                dispatch({ type: 'AUTH_FAILURE', payload: error.message });
                throw error;
            }
        },
        signup: async (credentials) => {
            dispatch({ type: 'AUTH_START' });
            try {
                const response = await fetch('http://localhost:3000/api/v1/user/signin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(credentials)
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message);
                }

                return data;
            } catch (error) {
                dispatch({ type: 'AUTH_FAILURE', payload: error.message });
                throw error;
            }
        },
        logout: async () => {
            try {
                await fetch('http://localhost:3000/api/v1/user/logout', {
                    method: 'GET',
                    credentials: 'include'
                });
                dispatch({ type: 'LOGOUT' });
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}