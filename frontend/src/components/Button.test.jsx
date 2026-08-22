import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/Button.jsx';

describe('Button', () => {
    it('affiche le texte passé en enfant', () => {
        render(<Button>Ajouter au panier</Button>);
        expect(screen.getByText('Ajouter au panier')).toBeInTheDocument();
    });

    it('déclenche onClick au clic quand le bouton est actif', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Valider</Button>);

        fireEvent.click(screen.getByText('Valider'));

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('ne déclenche pas onClick quand le bouton est désactivé', () => {
        const handleClick = vi.fn();
        render(
            <Button onClick={handleClick} disabled>
                Valider
            </Button>
        );

        fireEvent.click(screen.getByText('Valider'));

        expect(handleClick).not.toHaveBeenCalled();
    });

    it('applique le style "primary" par défaut', () => {
        render(<Button>Confirmer</Button>);
        expect(screen.getByText('Confirmer')).toHaveClass('bg-roux-principal');
    });

    it('applique le style "secondary" quand demandé', () => {
        render(<Button variant="secondary">Annuler</Button>);
        expect(screen.getByText('Annuler')).toHaveClass('border-noir-chaud');
    });
});