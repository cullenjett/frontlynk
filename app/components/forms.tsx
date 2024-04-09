import { useId } from 'react';

import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { cn } from '~/lib/styles';

interface FieldProps {
  className?: string;
  errors?: string[];
  inputProps: React.ComponentProps<typeof Input>;
  label?: React.ReactNode;
  renderLabel?(labelProps: React.ComponentProps<typeof Label>): JSX.Element;
}

export function Field({
  className,
  errors,
  inputProps,
  label,
  renderLabel
}: FieldProps) {
  const fallbackId = useId();
  const id = inputProps.id ?? fallbackId;
  const errorId = errors?.length ? `${id}-error` : undefined;

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

      <div className="grid gap-1">
        <Input
          id={id}
          aria-invalid={errorId ? true : undefined}
          aria-describedby={errorId}
          {...inputProps}
        />

        {errorId && <FieldErrors id={errorId} errors={errors} />}
      </div>
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
