import React from 'react';

const Button = React.forwardRef<HTMLButtonElement, any>(({ children, ...props }, ref) => {
  return (
    <button role="button" ref={ref} {...props}>
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };

import type { ButtonVariantProps } from './button.types';

export const buttonVariants = ({ variant, size, className }: ButtonVariantProps = {}) => {
  const variants = {
    default: 'btn-default',
    destructive: 'btn-destructive',
    outline: 'btn-outline',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    link: 'btn-link'
  };

  const sizes = {
    default: 'size-default',
    sm: 'size-sm',
    lg: 'size-lg',
    icon: 'size-icon'
  };

  return [
    variants[variant || 'default'],
    sizes[size || 'default'],
    className
  ].filter(Boolean).join(' ');
};