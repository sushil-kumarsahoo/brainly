import { type ReactElement } from "react";

interface ButtonProps {
  variant: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  text: string;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onClick: () => void;
}

const variantStyles = {
  primary: "bg-purple-600 text-white",
  secondary: "bg-purple-200 text-purple-600",
};

const sizeStyles = {
  sm: "py-1 px-2 text-sm gap-1",
  md: "py-2 px-4 text-md gap-2",
  lg: "py-4 px-6 text-lg gap-2",
};

const defaultStyles = "rounded-md flex items-center justify-center font-medium";

export const Button = ({
  variant,
  size,
  text,
  startIcon,
  endIcon,
  onClick,
}: ButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${variantStyles[variant]} ${sizeStyles[size]} ${defaultStyles}`}
    >
      <div className="flex">
        {startIcon }
        <span className="leading-none pl-1">{text}</span>
        {endIcon }
      </div>
    </button>
  );
};
