import clsx from 'clsx'
import { ButtonHTMLAttributes, FC, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  appearance: 'primary' | 'ghost' | 'secondary'
  size?: 'small' | 'medium' | 'large' | 'fit' | 'full'
}

export const Button: FC<ButtonProps> = ({
  appearance,
  size = 'medium',
  children,
  className,
  ...props
}) => {
  const appearanceClasses = {
    primary: 'bg-accent text-white transition-opacity duration-300 hover:opacity-80',
    ghost: 'bg-transparent text-primary border-primary hover:bg-primary',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600'
  }

  const sizeClasses = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
    fit: 'w-fit',
    full: 'w-full'
  }

  return (
    <button
      className={clsx(
        'rounded-default',
        appearanceClasses[appearance],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
