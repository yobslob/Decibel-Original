// services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1';

/**
 * Creates an axios instance with default configuration
 * @type {import('axios').AxiosInstance}
 */
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * Service for handling all authentication and user-related API calls
 */
export const authService = {
    /**
     * @param {{email: string, password: string}} credentials
     * @returns {Promise<User>}
     */
    async login(credentials) {
        try {
            const response = await api.post('/user/login', credentials);
            return response.data.user;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    },

    /**
     * @param {{username: string, email: string, password: string}} credentials
     * @returns {Promise<User>}
     */
    async signup(credentials) {
        try {
            const response = await api.post('/user/signin', credentials);
            return response.data.user;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Signup failed');
        }
    },

    /**
     * @returns {Promise<void>}
     */
    async logout() {
        try {
            await api.get('/user/logout');
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Logout failed');
        }
    },

    /**
     * @param {string} userId
     * @returns {Promise<User>}
     */
    async getProfile(userId) {
        try {
            const response = await api.get(`/user/${userId}`);
            return response.data.user;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch profile');
        }
    },

    /**
     * @param {FormData} formData
     * @returns {Promise<User>}
     */
    async updateProfile(formData) {
        try {
            const response = await api.post('/user/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data.user;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update profile');
        }
    },

    // Post related methods
    /**
     * @returns {Promise<Array>}
     */
    async getFeed() {
        try {
            const response = await api.get('/post/feed');
            return response.data.posts;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch feed');
        }
    },

    /**
     * @param {string} postId
     * @param {boolean} isLiked
     */
    async toggleLike(postId, isLiked) {
        try {
            const endpoint = isLiked ? 'dislike' : 'like';
            const response = await api.put(`/post/${endpoint}/${postId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to toggle like');
        }
    },

    /**
     * @param {string} postId
     */
    async toggleBookmark(postId) {
        try {
            const response = await api.put(`/post/bookmark/${postId}`);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to toggle bookmark';
            console.error('Bookmark error:', errorMessage);
            throw new Error(errorMessage);
        }
    }
};