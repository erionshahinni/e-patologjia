import React from 'react';

const Button = ({ variant = 'default', size = 'md', children, ...props }) => {
  const baseStyles = "px-4 py-2 rounded";
  const variantStyles = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    outline: "border border-blue-500 text-blue-500 hover:bg-blue-50",
    ghost: "text-blue-500 hover:bg-blue-50",
  }[variant];
  const sizeStyles = {
    sm: "text-sm px-3 py-1",
    md: "",
    lg: "text-lg px-6 py-3",
  }[size];

  return (
    <button {...props} className={`${baseStyles} ${variantStyles} ${sizeStyles}`}>
      {children}
    </button>
  );
};

export default Button;