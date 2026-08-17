const API_BASE_URL = 'http://localhost:8080';

export function getImageUrl(relativePath) {
    if (!relativePath) return null;
    return `${API_BASE_URL}${relativePath}`;
}