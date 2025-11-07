import React from 'react';

export const Slot = React.forwardRef<HTMLElement, any>(({ children, ...props }, ref) => {
  return React.cloneElement(children, { ...props, ref });
});

export const Dialog = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => {
  return (
    <div ref={ref} role="dialog" {...props}>
      {children}
    </div>
  );
});

Dialog.displayName = 'Dialog';
Slot.displayName = 'Slot';