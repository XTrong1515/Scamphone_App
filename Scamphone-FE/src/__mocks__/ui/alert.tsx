import React from 'react';

export function Alert({ children, ...props }: { children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div role="alert" {...props}>
      {children} 
    </div>
  );
}

export const alertVariants = ({ variant }: { variant?: 'default' | 'destructive' }) => {
  const variants = {
    default: 'alert-default',
    destructive: 'alert-destructive'
  };
  
  return variants[variant || 'default'];
};