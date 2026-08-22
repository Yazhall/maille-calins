import { describe, it, expect } from 'vitest';
import { getImageUrl } from '../utils/imageUrl.js';

describe('getImageUrl', () => {
    it('renvoie null quand aucun chemin relatif n\'est fourni', () => {
        expect(getImageUrl(null)).toBeNull();
        expect(getImageUrl(undefined)).toBeNull();
        expect(getImageUrl('')).toBeNull();
    });

    it('préfixe un chemin relatif avec l\'URL de base du backend', () => {
        expect(getImageUrl('/uploads/products/abc-123.jpg')).toBe(
            'http://localhost:8080/uploads/products/abc-123.jpg'
        );
    });

    it('préfixe correctement un chemin relatif de catégorie', () => {
        expect(getImageUrl('/uploads/categories/xyz-456.png')).toBe(
            'http://localhost:8080/uploads/categories/xyz-456.png'
        );
    });
});