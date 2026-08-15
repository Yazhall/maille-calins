export default function Input({ error = false, className = '', ...props }) {
    const base = 'w-full px-5 py-3 rounded-lg font-body text-noir-chaud bg-blanc border transition-colors outline-none placeholder:text-brun-gris';

    const state = error
        ? 'border-red-500 focus:border-red-500'
        : 'border-brun-gris/30 focus:border-roux-principal disabled:bg-roux-clair/30 disabled:text-brun-gris disabled:cursor-not-allowed';

    return (
        <input className={`${base} ${state} ${className}`} {...props} />
    );
}