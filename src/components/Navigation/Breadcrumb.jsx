import React from 'react';
import { useNavigate } from 'react-router-dom';

const Breadcrumb = ({ items = [] }) => {
  const navigate = useNavigate();

  if (items.length === 0) return null;

  return (
    <div className="flex items-center gap-2 text-sm mb-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item. href ? (
            <button
              onClick={() => navigate(item.href)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-gray-700">{item.label}</span>
          )}
          {index < items.length - 1 && (
            <span className="text-gray-400">/</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Breadcrumb;