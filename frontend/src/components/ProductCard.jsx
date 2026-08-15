export default function ProductCard({ image, name, details, price }) {
    return (
        <div className="w-full rounded-xl bg-blanc border border-[#E8DDD0] overflow-hidden">
            <div className="w-full aspect-square bg-roux-clair flex items-center justify-center overflow-hidden">
                {image ? (
                    <img src={image} alt={name} className="w-full h-full object-cover" />
                ) : null}
            </div>
            <div className="flex flex-col gap-1.5 p-3.5">
                <p className="font-body text-body text-noir-chaud">{name}</p>
                <p className="font-body text-body-sm text-brun-gris">{details}</p>
                <p className="font-body text-h3 font-semibold text-noir-chaud">{price}</p>
            </div>
        </div>
    );
}