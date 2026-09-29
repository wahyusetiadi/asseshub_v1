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
      className={clsx("sticky top-0 flex h-screen flex-col border-r border-slate-200 bg-white text-slate-900", className)}
      style={{ width: w }}
      {...rest}
    >
      <SidebarHeader
        logo={logo}
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse}
        appName={appName}
      />

      <nav className="flex-1 overflow-y-auto p-3 pt-5">
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

      {footer && <div className="border-t border-slate-200 p-3">{footer}</div>}
    </aside>
  );
}
