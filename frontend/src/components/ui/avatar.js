import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const avatarVariants = cva(
  "relative inline-flex items-center justify-center overflow-hidden",
  {
    variants: {
      variant: {
        circle: "rounded-full",
        square: "rounded-md",
        squircle: "rounded-xl",
      },
      size: {
        xs: "h-6 w-6 text-xs",
        sm: "h-8 w-8 text-sm",
        md: "h-10 w-10 text-base",
        lg: "h-12 w-12 text-lg",
        xl: "h-16 w-16 text-xl",
        "2xl": "h-20 w-20 text-2xl",
      },
      status: {
        online: "ring-2 ring-green-500",
        away: "ring-2 ring-yellow-500",
        offline: "ring-2 ring-gray-300",
        busy: "ring-2 ring-red-500",
        none: "",
      },
    },
    defaultVariants: {
      variant: "circle",
      size: "md",
      status: "none",
    },
  }
);

const fallbackVariants = cva(
  "flex h-full w-full items-center justify-center bg-slate-100 font-medium uppercase text-slate-800",
  {
    variants: {
      variant: {
        circle: "rounded-full",
        square: "rounded-md",
        squircle: "rounded-xl",
      },
    },
    defaultVariants: {
      variant: "circle",
    },
  }
);

const statusIndicatorVariants = cva(
  "absolute rounded-full ring-2 ring-white",
  {
    variants: {
      position: {
        "top-right": "top-0 right-0",
        "bottom-right": "bottom-0 right-0",
        "bottom-left": "bottom-0 left-0",
        "top-left": "top-0 left-0",
      },
      size: {
        xs: "h-1.5 w-1.5",
        sm: "h-2 w-2",
        md: "h-2.5 w-2.5",
        lg: "h-3 w-3",
        xl: "h-3.5 w-3.5",
        "2xl": "h-4 w-4",
      },
      status: {
        online: "bg-green-500",
        away: "bg-yellow-500",
        offline: "bg-gray-300",
        busy: "bg-red-500",
      },
    },
    defaultVariants: {
      position: "bottom-right",
      size: "md",
      status: "offline",
    },
  }
);

const groupVariants = cva(
  "flex items-center",
  {
    variants: {
      spacing: {
        tight: "-space-x-4",
        normal: "-space-x-2",
        loose: "-space-x-1",
      },
    },
    defaultVariants: {
      spacing: "normal",
    },
  }
);

const Avatar = React.forwardRef(({
  src,
  alt,
  fallback,
  variant,
  size,
  status,
  statusPosition = "bottom-right",
  showStatusIndicator = false,
  className,
  fallbackClassName,
  ...props
}, ref) => {
  const [hasError, setHasError] = React.useState(false);

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div
      ref={ref}
      className={cn(avatarVariants({ variant, size, status }), className)}
      {...props}
    >
      {!hasError && src ? (
        <img
          src={src}
          alt={alt}
          onError={handleError}
          className={cn(
            "h-full w-full object-cover",
            {
              "rounded-full": variant === "circle",
              "rounded-md": variant === "square",
              "rounded-xl": variant === "squircle",
            }
          )}
        />
      ) : (
        <div className={cn(fallbackVariants({ variant }), fallbackClassName)}>
          {fallback || (alt ? alt.charAt(0) : "U")}
        </div>
      )}
      
      {showStatusIndicator && status !== "none" && (
        <span className={cn(
          statusIndicatorVariants({ 
            position: statusPosition, 
            size, 
            status 
          })
        )} />
      )}
    </div>
  );
});

Avatar.displayName = "Avatar";

const AvatarGroup = React.forwardRef(({
  children,
  spacing,
  max,
  className,
  ...props
}, ref) => {
  const avatarCount = React.Children.count(children);
  const hasOverflow = max && avatarCount > max;
  
  const visibleAvatars = hasOverflow
    ? React.Children.toArray(children).slice(0, max)
    : children;
    
  const overflowCount = hasOverflow ? avatarCount - max : 0;

  return (
    <div
      ref={ref}
      className={cn(groupVariants({ spacing }), className)}
      {...props}
    >
      {visibleAvatars}
      
      {hasOverflow && (
        <Avatar 
          variant="circle"
          size={React.Children.toArray(children)[0]?.props?.size || "md"}
          fallback={`+${overflowCount}`}
          className="bg-slate-200 text-slate-700"
        />
      )}
    </div>
  );
});

AvatarGroup.displayName = "AvatarGroup";

// Example of usage with initials and image
const UserAvatar = ({ 
  user, 
  size = "md", 
  variant = "circle", 
  showStatus = false,
  ...props 
}) => {
  const fallbackInitials = user?.name
    ? `${user.name.split(' ')[0]?.[0] || ''}${user.name.split(' ')[1]?.[0] || ''}`
    : user?.email?.[0] || 'U';

  return (
    <Avatar
      src={user?.avatarUrl}
      alt={user?.name || user?.email || 'User'}
      fallback={fallbackInitials}
      size={size}
      variant={variant}
      status={user?.status || 'offline'}
      showStatusIndicator={showStatus}
      {...props}
    />
  );
};

export { Avatar, AvatarGroup, UserAvatar };