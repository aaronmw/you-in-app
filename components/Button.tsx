import clsx from 'clsx';
import { AnchorHTMLAttributes, ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = keyof typeof classNamesByVariant;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

interface AnchorButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
}

const commonClassNames = clsx(`
  cursor-pointer
`);

const baseButtonClassNames = clsx(`
  inline-block
  px-6
  py-3
  rounded-md
  hover:scale-105
  transition-all
  flex-grow-0
  w-fit
`);

const classNamesByVariant = {
  link: clsx(
    commonClassNames,
    `
      font-bold
      text-blue-900
      underline
      underline-offset-2
      hover:underline-offset-4
      hover:text-cyan-700
      transition-all
    `
  ),

  primary: clsx(
    commonClassNames,
    baseButtonClassNames,
    `
      bg-blue-900
      text-white
      font-display
      font-bold
    `
  ),

  secondary: clsx(
    commonClassNames,
    baseButtonClassNames,
    `
      border-2
      border-blue-900
      text-blue-900
      font-display
      font-bold
    `
  ),

  unstyled: commonClassNames,
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, variant = 'secondary', ...otherProps }, ref) => {
    return (
      <button
        className={`${classNamesByVariant[variant]} ${className}`}
        ref={ref}
        {...otherProps}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

const AnchorButton = forwardRef<HTMLAnchorElement, AnchorButtonProps>(
  ({ children, className, variant = 'secondary', ...otherProps }, ref) => {
    return (
      <a
        className={`${classNamesByVariant[variant]} ${className}`}
        ref={ref}
        {...otherProps}
      >
        {children}
      </a>
    );
  }
);

AnchorButton.displayName = 'AnchorButton';

export type { AnchorButtonProps };
export type { ButtonProps };
export { Button };
export { AnchorButton };
