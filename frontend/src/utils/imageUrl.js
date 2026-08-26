const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function getImageUrl(relativePath) {
    if (!relativePath) return null;
    return `${API_BASE_URL}${relativePath}`;
}