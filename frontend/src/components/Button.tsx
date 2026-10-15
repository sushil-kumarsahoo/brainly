import { type ReactElement } from "react";

interface ButtonProps {
  variant: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  text: string;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onClick?: () => void;
  fullWidth?: boolean;
  loading?: boolean;
}

const variantStyles = {
  primary: "bg-purple-600 text-white",
  secondary: "bg-purple-200 text-purple-600",
};

const sizeStyles = {
  sm: "py-2 px-2 text-sm gap-1",
  md: "py-3 px-4 text-md gap-2",
  lg: "py-4 px-6 text-lg gap-2",
};

const defaultStyles = "rounded-md flex items-center justify-center font-normal cursor-pointer";

export const Button = ({
  variant,
  size,
  text,
  startIcon,
  endIcon,
  onClick,
  fullWidth,
  loading
}: ButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`${variantStyles[variant]} ${sizeStyles[size]} ${defaultStyles} ${fullWidth ? " w-full" : ""} ${loading ? " opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div className="flex">
        {startIcon}
        <span className="leading-none pl-1.5">{text}</span>
        {endIcon }
      </div>
    </button>
  );
};
