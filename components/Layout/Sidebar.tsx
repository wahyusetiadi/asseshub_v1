import {
  SidebarGroupBlock,
  SidebarHeader,
  SidebarProps,
} from "@/helpers/sidebar.helper";
import clsx from "clsx";

/* ===== Main component ===== */
export default function Sidebar({
  logo,
  footer,
  groups,
  collapsed = false,
  onToggleCollapse,
  width = 260,
  collapsedWidth = 72,
  activeKey,
  currentPath,
  appName,
  className,
  ...rest
}: SidebarProps) {
  const w = collapsed ? collapsedWidth : width;

  return (
    <aside
      className={clsx("flex h-screen flex-col sticky top-0 bg-white text-black", className)}
      style={{ width: w }}
      {...rest}
    >
      <SidebarHeader
        logo={logo}
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse}
        appName={appName}
      />

      <nav className="flex-1 overflow-y-auto p-3">
        {groups.map((group) => (
          <SidebarGroupBlock
            key={group.key}
            group={group}
            collapsed={collapsed}
            activeKey={activeKey}
            currentPath={currentPath}
          />
        ))}
      </nav>

      {footer && <div className="border-t p-3">{footer}</div>}
    </aside>
  );
}
