export type AlertVariant = "success" | "error" | "warning" | "info";

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  message?: string;
  show?: boolean;
  onClose?: () => void;
  className?: string;
}

export interface AlertState  {
  show: boolean;
  variant: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
};
