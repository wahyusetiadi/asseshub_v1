import React from "react";
import clsx from "clsx";

export interface TopbarProps extends React.HTMLAttributes<HTMLElement> {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  sticky?: boolean;
  shadow?: boolean;
  height?: number;
}

export default function Topbar({
  left,
  center,
  right,
  sticky = true,
  shadow = true,
  height = 56,
  className,
  ...rest
}: TopbarProps) {
  return (
    <header
      className={clsx(
        "w-full bg-white border-b border-slate-300 overflow-x-hidden",
        sticky && "sticky top-0 z-40",
        shadow && "shadow-sm",
        className
      )}
      style={{ height }}
      {...rest}
    >
      <div className="mx-auto flex h-full max-w-full items-center gap-3 px-3 min-w-0">
        {/* LEFT */}
        <div className="flex items-center gap-2 min-w-0 shrink">
          {left}
        </div>

        {/* CENTER */}
        <div className="flex-1 min-w-0 overflow-hidden">
          {center}
        </div>

        {/* RIGHT (INI KUNCI) */}
        <div className="flex items-center gap-2 min-w-0 shrink max-w-full overflow-hidden">
          {right}
        </div>
      </div>
    </header>
  );
}
