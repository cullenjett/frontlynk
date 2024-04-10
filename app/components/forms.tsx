import { useId } from 'react';

import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { cn } from '~/lib/styles';

interface FieldProps {
  className?: string;
  errors?: string[];
  helpText?: React.ReactNode;
  inputProps: React.ComponentProps<typeof Input>;
  label?: React.ReactNode;
  renderLabel?(labelProps: React.ComponentProps<typeof Label>): JSX.Element;
}

export function Field({
  className,
  errors,
  helpText,
  inputProps,
  label,
  renderLabel
}: FieldProps) {
  const fallbackId = useId();
  const id = inputProps.id ?? fallbackId;
  const errorId = errors?.length ? `${id}-error` : undefined;
  const helpTextId = helpText ? `${id}-help-text` : undefined;

  return (
    <div className={cn('grid gap-2', className)}>
      {label ? (
        <Label htmlFor={id} variant={errorId ? 'destructive' : 'default'}>
          {label}
        </Label>
      ) : renderLabel ? (
        renderLabel({
          htmlFor: id,
          variant: errorId ? 'destructive' : 'default'
        })
      ) : null}

      <Input
        id={id}
        aria-invalid={errorId ? true : undefined}
        aria-describedby={errorId || helpTextId}
        {...inputProps}
      />

      {helpTextId && (
        <p
          id={helpTextId}
          className="text-xs text-muted-foreground font-medium"
        >
          {helpText}
        </p>
      )}

      {errorId && <FieldErrors id={errorId} errors={errors} />}
    </div>
  );
}

interface FieldErrorsProps {
  id: string;
  errors?: string[];
}

export function FieldErrors({ id, errors }: FieldErrorsProps) {
  if (!errors?.length) return null;

  return (
    <ul id={id} className="flex flex-col gap-1">
      {errors.map((e) => (
        <li key={e} className="text-xs font-medium text-destructive">
          {e}
        </li>
      ))}
    </ul>
  );
}
