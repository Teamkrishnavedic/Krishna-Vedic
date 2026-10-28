import React, { useState } from 'react';

interface BrandLogoProps {
  className?: string;
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const LOCAL_LOGO = '/logo.png';
const CLOUD_LOGO =
  'https://res.cloudinary.com/z1lnzmad/image/upload/v1793208196/krishnavedic/branding/krishnavedic_circle_logo.png';

export default function BrandLogo({
  className = '',
  showSubtitle = true,
  size = 'md',
}: BrandLogoProps) {
  const [imgSrc, setImgSrc] = useState(LOCAL_LOGO);

  const imgSize =
    size === 'sm'
      ? 'w-7 h-7'
      : size === 'lg'
      ? 'w-12 h-12 md:w-14 md:h-14'
      : 'w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11';

  const titleSize =
    size === 'sm'
      ? 'text-sm'
      : size === 'lg'
      ? 'text-xl sm:text-2xl'
      : 'text-base sm:text-lg';

  const subSize =
    size === 'sm'
      ? 'text-[8px]'
      : size === 'lg'
      ? 'text-xs'
      : 'text-[9px] sm:text-[10px]';

  return (
    <div className={`flex items-center gap-2 sm:gap-2.5 shrink-0 ${className}`}>
      {/* 1. Pure Circular Custom Emblem */}
      <img
        src={imgSrc}
        alt="Krishnavedic Emblem"
        onError={() => {
          if (imgSrc !== CLOUD_LOGO) {
            setImgSrc(CLOUD_LOGO);
          }
        }}
        className={`${imgSize} rounded-full object-contain shrink-0 active:scale-95 transition-transform`}
        loading="eager"
      />

      {/* 2. Brand Name Typography */}
      <div className="flex flex-col text-left leading-none">
        <span
          className={`font-serif ${titleSize} tracking-tight font-bold text-[#6e3418] uppercase leading-none`}
        >
          Krishnavedic
        </span>
        {showSubtitle && (
          <span
            className={`hidden xs:inline font-sans ${subSize} uppercase tracking-widest text-[#7d7567] font-semibold mt-0.5 leading-none`}
          >
            Bull-Driven Oils &amp; Spices
          </span>
        )}
      </div>
    </div>
  );
}
