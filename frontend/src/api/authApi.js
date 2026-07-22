import apiClient from './client';

export async function register({ email, password, firstName, lastName }) {
    const response = await apiClient.post('/register', {
        email,
        password,
        firstName,
        lastName,
    });
    return response.data;
}

export async function login({ email, password }) {
    const response = await apiClient.post('/login', {
        email,
        password,
    });
    return response.data;
}

export async function getMe() {
    const response = await apiClient.get('/me')
    return response.data
}