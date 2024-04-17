import { useInputControl } from '@conform-to/react';
import { useId } from 'react';

import { Checkbox } from '~/components/ui/checkbox';
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
          className="text-xs font-medium text-muted-foreground"
        >
          {helpText}
        </p>
      )}

      {errorId && <FieldErrors id={errorId} errors={errors} />}
    </div>
  );
}

interface CheckboxFieldProps {
  className?: string;
  errors?: string[];
  helpText?: React.ReactNode;
  checkboxProps: Omit<React.ComponentProps<typeof Checkbox>, 'type'> & {
    name: string;
    form: string;
    value?: string;
  };
  label?: React.ReactNode;
}

export function CheckboxField({
  className,
  errors,
  helpText,
  checkboxProps,
  label
}: CheckboxFieldProps) {
  const { key, defaultChecked, ...rest } = checkboxProps;
  const checkedValue = checkboxProps.value ?? 'on';
  const input = useInputControl({
    key,
    name: checkboxProps.name,
    formId: checkboxProps.form,
    initialValue: defaultChecked ? checkedValue : undefined
  });
  const fallbackId = useId();
  const id = checkboxProps.id ?? fallbackId;
  const errorId = errors?.length ? `${id}-error` : undefined;
  const helpTextId = helpText ? `${id}-help-text` : undefined;

  return (
    <div className={cn('grid gap-2', className)}>
      <div className="flex items-center gap-2">
        <Checkbox
          {...rest}
          id={id}
          aria-invalid={errorId ? true : undefined}
          aria-describedby={errorId || helpTextId}
          checked={input.value === checkedValue}
          onCheckedChange={(state) => {
            input.change(state.valueOf() ? checkedValue : '');
            checkboxProps.onCheckedChange?.(state);
          }}
          onFocus={(event) => {
            input.focus();
            checkboxProps.onFocus?.(event);
          }}
          onBlur={(event) => {
            input.blur();
            checkboxProps.onBlur?.(event);
          }}
          type="button"
        />
        <Label htmlFor={id} variant={errorId ? 'destructive' : 'default'}>
          {label}
        </Label>
      </div>

      {helpTextId && (
        <p
          id={helpTextId}
          className="text-xs font-medium text-muted-foreground"
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
