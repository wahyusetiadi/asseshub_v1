/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import clsx from 'clsx';

type Variant = 'default' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

export interface InputFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  variant?: Variant;
  size?: Size;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const inputBase =
  'w-full rounded-md transition-colors outline-none disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-gray-400 focus:ring-2 focus:ring-offset-0';
const inputVariants: Record<Variant, string> = {
  default: 'bg-white border border-gray-300 focus:border-blue-500 focus:ring-blue-500',
  outline: 'bg-white border-2 border-gray-300 focus:border-blue-600 focus:ring-blue-500',
  ghost: 'bg-transparent border border-transparent focus:border-blue-500 focus:ring-blue-500',
};
const inputSizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-base',
};
const errorRing = 'border-red-500 focus:border-red-500 focus:ring-red-500';
const withIconLeft = 'pl-9';
const withIconRight = 'pr-9';

function getInputClass(opts: {
  variant: Variant;
  size: Size;
  hasLeftIcon: boolean;
  hasRightIcon: boolean;
  hasError: boolean;
  readOnly?: boolean;
  extra?: string;
}) {
  const { variant, size, hasLeftIcon, hasRightIcon, hasError, readOnly, extra } = opts;
  return clsx(
    inputBase,
    inputVariants[variant],
    inputSizes[size],
    hasLeftIcon && withIconLeft,
    hasRightIcon && withIconRight,
    hasError && errorRing,
    readOnly && 'bg-gray-50',
    extra
  );
}

function FieldLabel({
  htmlFor,
  text,
  disabled,
  required,
}: {
  htmlFor: string;
  text?: string;
  disabled?: boolean;
  required?: boolean;
}) {
  if (!text) return null;
  return (
    <label
      htmlFor={htmlFor}
      className={clsx('mb-1 block text-sm font-medium', disabled ? 'text-gray-400' : 'text-gray-700')}
    >
      {text}
      {required && <span className="text-red-600"> *</span>}
    </label>
  );
}

function LeftIcon({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
      {children}
    </span>
  );
}

function RightIcon({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
      {children}
    </span>
  );
}

function HelperText({
  id,
  helperText,
  error,
}: {
  id: string;
  helperText?: string;
  error?: string;
}) {
  if (error) {
    return (
      <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
        {error}
      </p>
    );
  }
  if (helperText) {
    return (
      <p id={`${id}-help`} className="mt-1 text-xs text-gray-500">
        {helperText}
      </p>
    );
  }
  return null;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      id,
      label,
      helperText,
      error,
      variant = 'default',
      size = 'md',
      leftIcon,
      rightIcon,
      className,
      containerClassName,
      required,
      disabled,
      readOnly,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? React.useId();
    const describedBy = clsx(
      helperText && !error && `${inputId}-help`,
      error && `${inputId}-error`
    ) || undefined;

    const inputClass = getInputClass({
      variant,
      size,
      hasLeftIcon: !!leftIcon,
      hasRightIcon: !!rightIcon,
      hasError: !!error,
      readOnly,
      extra: className,
    });

    return (
      <div className={clsx('w-full', containerClassName)}>
        <FieldLabel htmlFor={inputId} text={label} disabled={disabled} required={required} />

        <div className="relative">
          <LeftIcon>{leftIcon}</LeftIcon>

          <input
            id={inputId}
            ref={ref}
            className={inputClass}
            aria-invalid={!!error || undefined}
            aria-describedby={describedBy}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            {...props}
          />

          <RightIcon>{rightIcon}</RightIcon>
        </div>

        <HelperText id={inputId} helperText={helperText} error={error} />
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;
