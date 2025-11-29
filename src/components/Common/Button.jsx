import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 px-6 py-2';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500 disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 disabled:border-gray-400 disabled:text-gray-400 disabled:hover:bg-white disabled:cursor-not-allowed',
  };

  const styles = `${baseStyles} ${variants[variant]} ${className}`;

  return (
    <button 
      className={styles}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;