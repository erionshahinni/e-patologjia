import React from 'react';

const Card = ({ children, ...props }) => (
  <div {...props} className="bg-white shadow-md rounded-lg p-6">
    {children}
  </div>
);

const CardHeader = ({ children, ...props }) => (
  <div {...props} className="flex justify-between items-center mb-4">
    {children}
  </div>
);

const CardTitle = ({ children, ...props }) => (
  <h3 {...props} className="text-xl font-semibold">
    {children}
  </h3>
);

const CardDescription = ({ children, ...props }) => (
  <p {...props} className="text-gray-500">
    {children}
  </p>
);

const CardContent = ({ children, ...props }) => (
  <div {...props} className="space-y-4">
    {children}
  </div>
);

const CardFooter = ({ children, ...props }) => (
  <div {...props} className="border-t border-gray-200 mt-6 pt-4">
    {children}
  </div>
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };