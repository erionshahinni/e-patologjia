import React from 'react';

const Badge = ({ variant = 'default', children, ...props }) => {
  const variantStyles = {
    default: "bg-gray-200 text-gray-700",
    outline: "border border-gray-300 text-gray-700",
  }[variant];

  return (
    <span {...props} className={`inline-block px-2 py-1 rounded ${variantStyles}`}>
      {children}
    </span>
  );
};

export default Badge;