import React, { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => (
  <button {...props}>{children}</button>
);

interface DialogProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Dialog: React.FC<DialogProps> = ({ children, open, onOpenChange }) => (
  open ? <div data-testid="dialog">{children}</div> : null
);

interface BaseProps {
  children: ReactNode;
}

export const DialogContent: React.FC<BaseProps> = ({ children }) => (
  <div data-testid="dialog-content">{children}</div>
);

export const DialogHeader: React.FC<BaseProps> = ({ children }) => (
  <div data-testid="dialog-header">{children}</div>
);

export const DialogTitle: React.FC<BaseProps> = ({ children }) => (
  <div data-testid="dialog-title">{children}</div>
);

export const Card: React.FC<BaseProps> = ({ children }) => (
  <div data-testid="card">{children}</div>
);

export const CardContent: React.FC<BaseProps> = ({ children }) => (
  <div data-testid="card-content">{children}</div>
);

interface AlertProps extends BaseProps {
  variant?: 'default' | 'destructive';
}

export const Alert: React.FC<AlertProps> = ({ children, variant }) => (
  <div data-testid="alert" data-variant={variant}>{children}</div>
);

export const AlertDescription: React.FC<BaseProps> = ({ children }) => (
  <div data-testid="alert-description">{children}</div>
);

export const Avatar: React.FC<BaseProps> = ({ children }) => (
  <div data-testid="avatar">{children}</div>
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea: React.FC<TextareaProps> = (props) => (
  <textarea data-testid="textarea" {...props} />
);