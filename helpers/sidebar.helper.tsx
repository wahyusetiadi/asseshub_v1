import Button from "@/components/ui/Button";
import clsx from "clsx";
import React from "react";

export type SidebarItem = {
  key: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  badge?: React.ReactNode;
  disabled?: boolean;
};

export type SidebarGroup = {
  key: string;
  title?: string;
  items: SidebarItem[];
};

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  footer?: React.ReactNode;
  groups: SidebarGroup[];
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  width?: number;
  collapsedWidth?: number;
  activeKey?: string;
  currentPath?: string;
  appName?: string;
}


const itemBase =
  "w-full flex items-center gap-3 px-3 py-2 rpunded-md transition-colors";
const itemEnabled = "text-gray-700 hover:bg-gray-100 hover:tedtext-gray-900";
const itemActive = "bg-blue-50 text-blue-700 hover:bg-blue-100";
const itemDisabled = "text-gray-400 cursor-not-allowed";

function itemJustify(collapsed: boolean) {
  return collapsed ? "justify-center" : "justify-start";
}

export function isActiveItem({
  activeKey,
  currentPath,
  item,
}: {
  activeKey?: string;
  currentPath?: string;
  item: SidebarItem;
}) {
  if (activeKey) return activeKey === item.key;
  if (!currentPath || !item.href) return false;
  return currentPath.startsWith(item.href);
}

export function itemClassName({
  collapsed,
  disabled,
  active,
}: {
  collapsed: boolean;
  disabled?: boolean;
  active?: boolean;
}) {
  const statCls = disabled ? itemDisabled : active ? itemActive : itemEnabled;
  return clsx(itemBase, statCls, itemJustify(collapsed));
}

export function ItemLabel({ collapsed, children }: { collapsed?: boolean; children: React.ReactNode }) {
  return collapsed ? null : <span className="truncate">{children}</span>;
}

export function ItemBadge({
  collapsed,
  children,
}: {
  collapsed?: boolean;
  children?: React.ReactNode;
}) {
  return !collapsed && children ? (
    <span className="ml-auto">{children}</span>
  ) : null;
}

function LogoTitle({
  logo,
  collapsed,
  appName,
}: {
  logo?: React.ReactNode;
  collapsed: boolean;
  appName?: string;
}) {
  return (
    <>
      {logo ?? <div className="h-8 w-8 rounded bg-blue-600" />}
      {!collapsed && (
        <span className="font-semibold">{appName ?? "My App"}</span>
      )}
    </>
  );
}

function ToggleButton({
  collapsed,
  onClick,
}: {
  collapsed: boolean;
  onClick?: () => void;
}) {
  const path = collapsed ? "M9 6l6 6-6 6" : "M15 18l-6-6 6-6";
  const label = collapsed ? "Expand sidebar" : "Collapse sidebar";
  return (
    <Button
      variant="ghost"
      size="icon"
      className="ml-auto"
      aria-label={label}
      onClick={onClick}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" className="text-gray-600">
        <path fill="currentColor" d={path} />
      </svg>
    </Button>
  );
}

export function SidebarHeader({
  logo,
  collapsed,
  onToggleCollapse,
  appName = "",
}: {
  logo?: React.ReactNode;
  collapsed: boolean;
  onToggleCollapse?: () => void;
  appName?: string;
}) {
  return (
    <div className={`flex items-center gap-2 px-3 py-3 ${collapsed ? "justify-center" : ""}`}>
      <LogoTitle logo={logo} collapsed={collapsed} appName={appName} />
      {/* <ToggleButton collapsed={collapsed} onClick={onToggleCollapse} /> */}
    </div>
  );
}

function NavAnchor({
  href,
  className,
  disabled,
  active,
  children,
}: {
  href: string;
  className: string;
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      aria-current={active ? "page" : undefined}
      aria-disabled={disabled || undefined}
      onClick={disabled ? (e) => e.preventDefault() : undefined}
    >
      {children}
    </a>
  );
}

function NavButton({
  onClick,
  className,
  disabled,
  active,
  children,
}: {
  onClick?: () => void;
  className: string;
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="md"
      className={clsx(
        "w-full text-left focus:ring-2 focus:ring-blue-500 focus:ring-offset-0",
        className
      )}
      disabled={disabled}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Button>
  );
}

export function NavItem({
  item,
  active,
  collapsed,
}: {
  item: SidebarItem;
  active: boolean;
  collapsed: boolean;
}) {
  const classes = itemClassName({ collapsed, disabled: item.disabled, active });
  const content = (
    <>
      {item.icon && <span className="shrink-0">{item.icon}</span>}
      <ItemLabel collapsed={collapsed}>{item.label}</ItemLabel>
      <ItemBadge collapsed={collapsed}>{item.badge}</ItemBadge>
    </>
  );

  return item.href ? (
    <NavAnchor
      href={item.href}
      className={classes}
      disabled={item.disabled}
      active={active}
    >
      {content}
    </NavAnchor>
  ) : (
    <NavButton
      onClick={item.onClick}
      className={classes}
      disabled={item.disabled}
      active={active}
    >
      {content}
    </NavButton>
  );
}

function GroupTitle({
  title,
  collapsed,
}: {
  title?: string;
  collapsed: boolean;
}) {
  if (!title || collapsed) return null;
  return (
    <div className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
      {title}
    </div>
  );
}

function renderGroupItem({
  item,
  collapsed,
  activeKey,
  currentPath,
}: {
  item: SidebarItem;
  collapsed: boolean;
  activeKey?: string;
  currentPath?: string;
}) {
  const active = isActiveItem({ activeKey, currentPath, item });
  return (
    <li key={item.key}>
      <NavItem item={item} active={active} collapsed={collapsed} />
    </li>
  );
}

export function SidebarGroupBlock({
  group,
  collapsed,
  activeKey,
  currentPath,
}: {
  group: SidebarGroup;
  collapsed: boolean;
  activeKey?: string;
  currentPath?: string;
}) {
  return (
    <div className="mb-3">
      <GroupTitle title={group.title} collapsed={collapsed} />
      <ul className="space-y-1">
        {group.items.map((item) =>
          renderGroupItem({ item, collapsed, activeKey, currentPath })
        )}
      </ul>
    </div>
  );
}
