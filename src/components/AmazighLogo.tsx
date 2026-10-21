import React from 'react';
import { useShop } from '../context/ShopContext';

interface LogoProps {
  className?: string;
  size?: number;
}

export const AmazighLogo: React.FC<LogoProps> = ({ className = "w-12 h-12", size }) => {
  const { settings } = useShop();
  return (
    <img 
      src={settings.logo_url || "/Logo_AMAZIGH.png"} 
      alt="Logo AMAZIGH" 
      className={`object-contain rounded-full shadow-gold ${className}`}
      style={size ? { width: size, height: size } : undefined}
    />
  );
};
