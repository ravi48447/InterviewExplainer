import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps extends Omit<React.ComponentProps<'input'>, 'size'> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  error?: boolean
  inputSize?: 'sm' | 'default' | 'lg'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon, rightIcon, error, inputSize = 'default', ...props }, ref) => {
    return (
      <div className="relative w-full flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-muted-foreground flex items-center justify-center pointer-events-none [&_svg]:size-4">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all',
            // Icons padding
            leftIcon && 'pl-9',
            rightIcon && 'pr-9',
            // Sizes
            inputSize === 'sm' && 'h-8 text-xs px-2.5',
            inputSize === 'default' && 'h-10 text-sm px-3',
            inputSize === 'lg' && 'h-12 text-base px-4 rounded-lg',
            // Error state
            error && 'border-destructive focus-visible:ring-destructive focus-visible:ring-offset-1',
            className,
          )}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 text-muted-foreground flex items-center justify-center [&_svg]:size-4">
            {rightIcon}
          </div>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
