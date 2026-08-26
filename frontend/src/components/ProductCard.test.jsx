import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductCard from '../components/ProductCard.jsx';

describe('ProductCard', () => {
    it('affiche le nom, les détails et le prix du produit', () => {
        render(
            <ProductCard
                image={null}
                name="Lapin en laine"
                details="15 cm · Pièce unique"
                price="19.90 €"
            />
        );

        expect(screen.getByText('Lapin en laine')).toBeInTheDocument();
        expect(screen.getByText('15 cm · Pièce unique')).toBeInTheDocument();
        expect(screen.getByText('19.90 €')).toBeInTheDocument();
    });

    it('affiche une image quand une URL est fournie', () => {
        render(
            <ProductCard
                image="http://localhost:8080/uploads/products/abc.jpg"
                name="Lapin en laine"
                details="15 cm · Pièce unique"
                price="19.90 €"
            />
        );

        const img = screen.getByAltText('Lapin en laine');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', 'http://localhost:8080/uploads/products/abc.jpg');
    });

    it('n\'affiche aucune image quand aucune URL n\'est fournie', () => {
        render(
            <ProductCard
                image={null}
                name="Lapin en laine"
                details="15 cm · Pièce unique"
                price="19.90 €"
            />
        );

        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
});