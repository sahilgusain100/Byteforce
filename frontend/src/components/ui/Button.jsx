// Button.jsx
import React from 'react';

export const Button = ({ 
  children, 
  type = 'button', 
  onClick, 
  className = '', 
  ...props 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 bg-secondary text-white rounded hover:bg-secondary-hover transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
