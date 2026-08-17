export default function Button({ variant = 'primary', children, className = '', disabled = false, ...props }) {
    const base = 'inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-lg font-body font-medium transition-colors';

    const variants = {
        primary: 'bg-roux-principal text-blanc hover:bg-roux-fonce disabled:bg-brun-gris disabled:cursor-not-allowed',
        secondary: 'bg-transparent text-noir-chaud border border-noir-chaud hover:bg-roux-clair disabled:border-roux-clair disabled:text-brun-gris disabled:cursor-not-allowed',
    };

    return (
        <button
            className={`${base} ${variants[variant]} ${!disabled ? 'cursor-pointer' : ''} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}