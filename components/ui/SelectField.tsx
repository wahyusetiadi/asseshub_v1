// components/ui/SelectField.tsx
"use client";

import React from "react";
import clsx from "clsx";

type Variant = "default" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectFieldProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  helperText?: string;
  error?: string;
  variant?: Variant;
  size?: Size;
  options: SelectOption[];
  placeholder?: string;
  containerClassName?: string;
}

const selectBase =
  "w-full rounded-md transition-colors outline-none disabled:opacity-60 disabled:cursor-not-allowed focus:ring-2 focus:ring-offset-0 appearance-none bg-no-repeat bg-right";

const selectVariants: Record<Variant, string> = {
  default:
    "bg-white border border-gray-300 focus:border-blue-500 focus:ring-blue-500",
  outline:
    "bg-white border-2 border-gray-300 focus:border-blue-600 focus:ring-blue-500",
  ghost:
    "bg-transparent border border-transparent focus:border-blue-500 focus:ring-blue-500",
};

const selectSizes: Record<Size, string> = {
  sm: "h-9 px-3 pr-8 text-sm",
  md: "h-10 px-3 pr-8 text-sm",
  lg: "h-12 px-4 pr-10 text-base",
};

const errorRing = "border-red-500 focus:border-red-500 focus:ring-red-500";

function getSelectClass(opts: {
  variant: Variant;
  size: Size;
  hasError: boolean;
  extra?: string;
}) {
  const { variant, size, hasError, extra } = opts;
  return clsx(
    selectBase,
    selectVariants[variant],
    selectSizes[size],
    hasError && errorRing,
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
      className={clsx(
        "mb-1 block text-sm font-medium",
        disabled ? "text-gray-400" : "text-gray-700"
      )}
    >
      {text}
      {required && <span className="text-red-600"> *</span>}
    </label>
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

// SVG Chevron Icon
function ChevronIcon() {
  return (
    <svg
      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const SelectField = React.forwardRef<
  HTMLSelectElement,
  SelectFieldProps
>(
  (
    {
      id,
      label,
      helperText,
      error,
      variant = "default",
      size = "md",
      options,
      placeholder,
      className,
      containerClassName,
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    // ✅ FIX 1: Panggil useId unconditionally
    const generatedId = React.useId();
    const selectId = id || generatedId;

    const describedBy =
      clsx(
        helperText && !error && `${selectId}-help`,
        error && `${selectId}-error`
      ) || undefined;

    // ✅ FIX 2: Hapus readOnly dari parameter
    const selectClass = getSelectClass({
      variant,
      size,
      hasError: !!error,
      extra: className,
    });

    return (
      <div className={clsx("w-full", containerClassName)}>
        <FieldLabel
          htmlFor={selectId}
          text={label}
          disabled={disabled}
          required={required}
        />

        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={selectClass}
            aria-invalid={!!error || undefined}
            aria-describedby={describedBy}
            required={required}
            disabled={disabled}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          <ChevronIcon />
        </div>

        <HelperText id={selectId} helperText={helperText} error={error} />
      </div>
    );
  }
);

SelectField.displayName = "SelectField";

export default SelectField;
