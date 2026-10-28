import React, { useState } from 'react';

interface BrandLogoProps {
  className?: string;
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const LOCAL_LOGO = '/logo.png';
const CLOUD_LOGO =
  'https://res.cloudinary.com/z1lnzmad/image/upload/v1793207628/krishnavedic/branding/cpn2bmbcd9vozwtzmmyz.png';

export default function BrandLogo({
  className = '',
  size = 'md',
}: BrandLogoProps) {
  const [imgSrc, setImgSrc] = useState(LOCAL_LOGO);

  const heightClass =
    size === 'sm'
      ? 'h-7 sm:h-8'
      : size === 'lg'
      ? 'h-12 sm:h-14 md:h-16'
      : 'h-8 sm:h-9 md:h-11';

  return (
    <div className={`flex items-center shrink-0 ${className}`}>
      <img
        src={imgSrc}
        alt="Krishnavedic"
        onError={() => {
          if (imgSrc !== CLOUD_LOGO) {
            setImgSrc(CLOUD_LOGO);
          }
        }}
        className={`${heightClass} w-auto object-contain rounded-lg transition-transform active:scale-95`}
        loading="eager"
      />
    </div>
  );
}
