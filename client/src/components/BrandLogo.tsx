import React from 'react';

interface BrandLogoProps {
  className?: string;
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function BrandLogo({ className = '', showSubtitle = true, size = 'md' }: BrandLogoProps) {
  const iconSize = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-11 h-11' : 'w-8 h-8 sm:w-10 sm:h-10';
  const titleSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg';
  const subSize = size === 'sm' ? 'text-[8px]' : size === 'lg' ? 'text-xs' : 'text-[9px] sm:text-[10px]';

  return (
    <div className={`flex items-center gap-2 sm:gap-3 shrink-0 ${className}`}>
      {/* Handcrafted Bull-Ghani & Wooden Mortar Vedic Emblem */}
      <div className={`${iconSize} rounded-xl sm:rounded-2xl bg-[#6e3418] text-[#fafbf5] flex items-center justify-center shadow-xs shrink-0 p-1 sm:p-1.5 border border-[#522510]/30`}>
        <svg viewBox="0 0 32 32" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Earthen / Wooden Ghani Mortar Base */}
          <path
            d="M6 21C6 17.5 9 14 16 14C23 14 26 17.5 26 21C26 24.5 22.5 27 16 27C9.5 27 6 24.5 6 21Z"
            fill="#e5e2da"
            opacity="0.3"
          />
          <path
            d="M7 20C7 24 10.5 26.5 16 26.5C21.5 26.5 25 24 25 20C24 20 22 17 16 17C10 17 8 20 7 20Z"
            fill="#f59e0b"
          />
          {/* Central Wooden Pestle */}
          <path
            d="M14.5 6C14.5 5.17 15.17 4.5 16 4.5C16.83 4.5 17.5 5.17 17.5 6V18C17.5 18.83 16.83 19.5 16 19.5C15.17 19.5 14.5 18.83 14.5 18V6Z"
            fill="#fafbf5"
          />
          {/* Golden Pure Cold-Pressed Drop */}
          <circle cx="16" cy="11" r="1.5" fill="#f59e0b" />
          <path
            d="M16 8.5C16 8.5 14.5 10.5 14.5 11.5C14.5 12.33 15.17 13 16 13C16.83 13 17.5 12.33 17.5 11.5C17.5 10.5 16 8.5 16 8.5Z"
            fill="#fafbf5"
          />
          {/* Symmetrical Vedic Grain / Leaf Accents */}
          <path
            d="M10 15C10 15 11 13 12.5 13.5C14 14 13.5 16 12 16.5C10.5 17 10 15 10 15Z"
            fill="#fafbf5"
            opacity="0.8"
          />
          <path
            d="M22 15C22 15 21 13 19.5 13.5C18 14 18.5 16 20 16.5C21.5 17 22 15 22 15Z"
            fill="#fafbf5"
            opacity="0.8"
          />
        </svg>
      </div>

      <div className="flex flex-col text-left">
        <span className={`font-serif ${titleSize} tracking-tight font-bold text-[#6e3418] uppercase leading-none`}>
          Krishnavedic
        </span>
        {showSubtitle && (
          <span className={`hidden xs:inline font-sans ${subSize} uppercase tracking-widest text-[#7d7567] font-semibold mt-0.5 leading-none`}>
            Bull-Driven Oils &amp; Spices
          </span>
        )}
      </div>
    </div>
  );
}
