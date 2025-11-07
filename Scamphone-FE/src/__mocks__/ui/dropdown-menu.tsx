import React from 'react';

const Root = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));

const Content = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));

const Item = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
  <div ref={ref} role="menuitem" {...props}>
    {children}
  </div>
));

const DropdownMenu = {
  Root,
  Content,
  Item,
  // Add other needed components
  Trigger: Root,
  Label: Root,
  Separator: Root,
  Portal: Root
};

Root.displayName = 'DropdownMenu.Root';
Content.displayName = 'DropdownMenu.Content'; 
Item.displayName = 'DropdownMenu.Item';

export { DropdownMenu };