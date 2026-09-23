import React from 'react';
import { CUTE_AVATARS } from '../../types';

interface AvatarProps {
  avatarId?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ avatarId = 'avatar-jinu', size = 'md', className = '' }) => {
  const target = CUTE_AVATARS.find((a) => a.id === avatarId || a.name === avatarId) || CUTE_AVATARS[0];

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-xl',
    xl: 'w-20 h-20 text-3xl',
  };

  return (
    <div
      className={`rounded-2xl flex items-center justify-center shrink-0 overflow-hidden shadow-xs border ${target.bgColor} ${sizeClasses[size]} ${className}`}
    >
      {target.image ? (
        <img src={target.image} alt={target.name} className="w-full h-full object-contain p-0.5" />
      ) : (
        <span className="leading-none">{target.icon}</span>
      )}
    </div>
  );
};
