import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '~/lib/styles';

const cardVariants = cva(null, {
  variants: {
    decoration: {
      blue: 'border-t-4 border-t-jordy-blue',
      orange: 'border-t-4 border-t-burnt-sienna',
      dark: 'border-t-4 border-t-mirage',
      green: 'border-t-4 border-t-blue-chill'
    }
  }
});

/**
 * A custom convenience wrapper around the different Card components
 */
export const Card = ({
  className,
  decoration,
  header,
  title,
  children,
  footer
}: {
  className?: string;
  header?: React.ReactNode;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
} & VariantProps<typeof cardVariants>) => {
  return (
    <CardOuter className={cn(cardVariants({ decoration, className }))}>
      {(header || title) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {header}
        </CardHeader>
      )}
      {children && (
        <CardContent
          className={cn({
            'pt-6': !header && !title
          })}
        >
          {children}
        </CardContent>
      )}
      {footer && <CardFooter>{footer}</CardFooter>}
    </CardOuter>
  );
};

const CardOuter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-lg border bg-card text-card-foreground shadow-sm',
      className
    )}
    {...props}
  />
));
CardOuter.displayName = 'CardOuter';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('font-semibold leading-none tracking-tight', className)}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export {
  CardOuter,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent
};
