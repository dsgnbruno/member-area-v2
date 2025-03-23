import React from 'react';

interface LogoProps {
  theme: string;
  size?: number;
  maxHeight?: number;
}

const Logo: React.FC<LogoProps> = ({ theme, size, maxHeight = 45 }) => {
  // Use different logos based on theme
  const logoSrc = theme === 'dark' 
    ? 'https://brunofariacom26d96.zapwp.com/q:u/r:0/wp:1/w:1/u:https://brunofaria.com/wp-content/uploads/2025/03/logo-brunofaria-white.svg'
    : 'https://brunofariacom26d96.zapwp.com/q:u/r:0/wp:1/w:1/u:https://brunofaria.com/wp-content/uploads/2025/03/logo-brunofaria-black.svg';
  
  return (
    <div className="flex items-center" aria-label="Learning Portal Logo">
      <img 
        src={logoSrc} 
        alt="Learning Portal Logo" 
        style={{ maxHeight: `${maxHeight}px` }}
        className="h-full object-contain"
      />
    </div>
  );
}

export default Logo;
