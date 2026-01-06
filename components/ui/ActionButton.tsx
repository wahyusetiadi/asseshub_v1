// components/ui/ActionButton.tsx
import { IconType } from "react-icons";

interface ActionButtonProps {
  icon: IconType;
  onClick: () => void;
  variant?: "primary" | "warning" | "danger";
  size?: number;
  disabled?: boolean;
  tooltip?: string;
}

const variantStyles = {
  primary: "text-blue-600 hover:bg-blue-50",
  warning: "text-yellow-600 hover:bg-yellow-50",
  danger: "text-red-600 hover:bg-red-50",
};

export default function ActionButton({
  icon: Icon,
  onClick,
  variant = "primary",
  size = 18,
  disabled = false,
  tooltip,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={`
        p-2 rounded-lg transition-colors
        ${variantStyles[variant]}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <Icon size={size} />
    </button>
  );
}
