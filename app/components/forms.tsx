import { useId } from 'react';

import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { cn } from '~/lib/styles';

interface FieldProps {
  className?: string;
  error?: React.ReactNode;
  inputProps: React.ComponentProps<typeof Input>;
  label?: React.ReactNode;
  renderLabel?(labelProps: React.ComponentProps<typeof Label>): JSX.Element;
}

export function Field({
  className,
  error,
  inputProps,
  label,
  renderLabel
}: FieldProps) {
  const fallbackId = useId();
  const id = inputProps.id ?? fallbackId;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={cn('grid gap-2', className)}>
      {label ? (
        <Label htmlFor={id} variant={error ? 'destructive' : 'default'}>
          {label}
        </Label>
      ) : renderLabel ? (
        renderLabel({
          htmlFor: id,
          variant: error ? 'destructive' : 'default'
        })
      ) : null}

      <div className="grid gap-1">
        <Input
          id={id}
          aria-invalid={errorId ? true : undefined}
          aria-describedby={errorId}
          {...inputProps}
        />

        {error && <FieldError id={errorId}>{error}</FieldError>}
      </div>
    </div>
  );
}

function FieldError({
  children,
  className,
  ...rest
}: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(className, 'text-xs font-medium text-destructive')}
      {...rest}
    >
      {children}
    </p>
  );
}
