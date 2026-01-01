import React from 'react';
import clsx from 'clsx';

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
        'w-full bg-white border-b',
        sticky && 'sticky top-0 z-40',
        shadow && 'shadow-sm',
        className
      )}
      style={{ height }}
      {...rest}
    >
      <div className="mx-auto flex h-full max-w-full items-center gap-3 px-3">
        <div className="flex items-center gap-2 min-w-0">{left}</div>
        <div className="flex-1 min-w-0">{center}</div>
        <div className="flex items-center gap-2">{right}</div>
      </div>
    </header>
  );
}
