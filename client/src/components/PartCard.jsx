import { useState } from 'react';

function PlaceholderImage() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-light-red-bg">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-10 h-10 text-primary-red/40"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L14 14m0 0 2.586-2.586a2 2 0 0 1 2.828 0L21 13M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M4 16V6a2 2 0 0 1 2-2h4M14 14V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v7"
        />
      </svg>
    </div>
  );
}

export default function PartCard({ part }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showPlaceholder = !part.imageUrl || imageFailed;
  const outOfStock = part.stock <= 0;

  return (
    <div
      className={`bg-white border border-primary-red/20 rounded-lg overflow-hidden flex flex-col hover:shadow-md transition-shadow ${
        outOfStock ? 'opacity-70' : ''
      }`}
    >
      <div className="aspect-square bg-light-red-bg relative">
        {showPlaceholder ? (
          <PlaceholderImage />
        ) : (
          <img
            src={part.imageUrl}
            alt={part.name}
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover"
          />
        )}
        {outOfStock && (
          <span className="absolute top-2 right-2 bg-dark-red text-white text-[11px] font-medium uppercase tracking-wide px-2 py-1 rounded">
            Out of Stock
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col gap-1 flex-1">
        <span className="text-[11px] uppercase tracking-wide text-primary-red font-medium">
          {part.category}
          {part.brand ? ` · ${part.brand}` : ''}
        </span>
        <p className="font-medium text-dark-red text-sm leading-snug">{part.name}</p>
        <p className="text-xs text-gray-500">{part.vendorName}</p>
        <div className="flex items-center justify-between mt-auto pt-2">
          <p className="font-medium text-primary-red text-base">{`৳${part.price}`}</p>
          {!outOfStock && <p className="text-xs text-gray-500">{part.stock} in stock</p>}
        </div>
      </div>
    </div>
  );
}
