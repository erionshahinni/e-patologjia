// components/ui/alert.js
import React from 'react';

const alertStyles = {
  base: "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  variants: {
    default: "bg-white text-gray-900 border-gray-200",
    destructive: "border-red-500/50 text-red-700 dark:text-red-400",
    success: "border-green-500/50 text-green-700 dark:text-green-400",
    warning: "border-yellow-500/50 text-yellow-700 dark:text-yellow-400"
  }
};

export const Alert = React.forwardRef(({ className = '', variant = 'default', ...props }, ref) => {
  const variantClass = alertStyles.variants[variant] || alertStyles.variants.default;
  
  return (
    <div
      ref={ref}
      role="alert"
      className={`${alertStyles.base} ${variantClass} ${className}`}
      {...props}
    />
  );
});

export const AlertDescription = React.forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm [&_p]:leading-relaxed ${className}`}
    {...props}
  />
));

Alert.displayName = 'Alert';
AlertDescription.displayName = 'AlertDescription';