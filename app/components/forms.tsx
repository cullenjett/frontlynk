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
    <div className={cn('flex flex-col gap-2', className)}>
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
    <div className={cn('flex flex-col gap-2', className)}>
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

interface SelectFieldProps {
  className?: string;
  errors?: string[];
  helpText?: React.ReactNode;
  label?: React.ReactNode;
  options?: Array<{
    label: React.ReactNode;
    value: string;
    disabled?: boolean;
  }>;
  selectProps: React.ComponentProps<'select'>;
}

export function SelectField({
  className,
  label,
  options,
  errors,
  helpText,
  selectProps
}: SelectFieldProps) {
  const fallbackId = useId();
  const id = selectProps.id ?? fallbackId;
  const errorId = errors?.length ? `${id}-error` : undefined;
  const helpTextId = helpText ? `${id}-help-text` : undefined;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={id} variant={errorId ? 'destructive' : 'default'}>
        {label}
      </Label>
      <select
        {...selectProps}
        className={cn(
          'flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 pr-9 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          selectProps.className
        )}
      >
        {options?.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

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

const STATES = [
  { value: '', label: '', disabled: true },
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'DC', label: 'District of Columbia' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' }
];

export function StateSelectField(
  props: React.ComponentProps<typeof SelectField>
) {
  return <SelectField {...props} options={STATES} />;
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
