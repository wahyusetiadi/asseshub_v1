"use client";

import { AlertProps, AlertVariant } from "@/types/alert.types";
import clsx from "clsx";
import { JSX } from "react";
import { BiCheckCircle, BiX } from "react-icons/bi";

const variantStyles: Record<
  AlertVariant,
  {
    container: string;
    icon: JSX.Element;
  }
> = {
  success: {
    container: "bg-green-50 border-green-400 text-green-800",
    icon: <BiCheckCircle className="size-5 text-green-600" />,
  },
  error: {
    container: "bg-red-50 border-red-400 text-red-800",
    icon: <BiCheckCircle className="size-5 text-red-600" />,
  },
  warning: {
    container: "bg-yellow-50 border-yellow-400 text-yellow-800",
    icon: <BiCheckCircle className="size-5 text-yellow-600" />,
  },
  info: {
    container: "bg-blue-50 border-blue-400 text-blue-800",
    icon: <BiCheckCircle className="size-5 text-blue-600" />,
  },
};

export default function Alert({
  variant = "info",
  title,
  message,
  show = true,
  onClose,
  className,
}: AlertProps) {
  if (!show) return null;

  const styles = variantStyles[variant];

  return (
    <div
      className={clsx(
        "relative flex gap-3 p-4 border rounded-lg w-10",
        styles.container,
        className
      )}
    >
      <div className="mt-0.5">{styles.icon}</div>
      <div className="flex-1 text-sm md:text-base">
        {title && <h4 className="font-semibold">{title}</h4>}
        <p className="text-xs md:text-sm">{message}</p>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <BiX size={16} />
        </button>
      )}
    </div>
  );
}
