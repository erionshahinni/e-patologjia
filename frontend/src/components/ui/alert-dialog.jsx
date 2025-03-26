// components/ui/alert-dialog.jsx
  
export const AlertDialog = ({ open, onOpenChange, children }) => {
    if (!open) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
        <div className="relative z-50">
          {children}
        </div>
      </div>
    );
  };
  
  export const AlertDialogContent = ({ children, className = "" }) => {
    return (
      <div className={`fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg ${className}`}>
        {children}
      </div>
    );
  };
  
  export const AlertDialogHeader = ({ children, className = "" }) => {
    return (
      <div className={`mb-4 ${className}`}>
        {children}
      </div>
    );
  };
  
  export const AlertDialogTitle = ({ children, className = "" }) => {
    return (
      <h2 className={`text-lg font-semibold ${className}`}>
        {children}
      </h2>
    );
  };
  
  export const AlertDialogDescription = ({ children, className = "" }) => {
    return (
      <p className={`mt-2 text-sm text-gray-500 ${className}`}>
        {children}
      </p>
    );
  };
  
  export const AlertDialogFooter = ({ children, className = "" }) => {
    return (
      <div className={`mt-6 flex justify-end gap-2 ${className}`}>
        {children}
      </div>
    );
  };
  
  export const AlertDialogAction = ({ children, className = "", ...props }) => {
    return (
      <button
        className={`inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };
  
  export const AlertDialogCancel = ({ children, className = "", ...props }) => {
    return (
      <button
        className={`inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };