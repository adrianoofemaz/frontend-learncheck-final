import React from 'react';

const Card = ({ 
  children, 
  className = '',
  title,
  description,
  bordered = false,
  shadow = 'lg'
}) => {
  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    none: 'shadow-none'
  };

  return (
    <div className={`bg-white rounded-xl p-6 ${shadowClasses[shadow]} ${bordered ? 'border border-gray-200' : ''} ${className}`}>
      {title && <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>}
      {description && <p className="text-sm text-gray-600 mb-4">{description}</p>}
      {children}
    </div>
  );
};

export default Card;