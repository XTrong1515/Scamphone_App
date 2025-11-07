import React from 'react';

const Avatar = React.forwardRef<HTMLSpanElement, any>(({ children, ...props }, ref) => {
  return (
    <span role="img" ref={ref} {...props}>
      {children}
    </span>
  );
});

Avatar.displayName = 'Avatar';

export { Avatar };