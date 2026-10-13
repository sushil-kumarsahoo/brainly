import type { ReactElement } from "react";

interface ButtonProps {
  variant: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  text: string;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onClick: () => void;
};

const variantStyles = {
  primary: "bg-purple-600 text-white",
  secondary: "bg-purple-200 text-purple-600",
};

const sizeStyles = {
  sm: "py-1 px-2",
  md: "py-2 px-4",
  lg: "py-4 px-6",
};

const defaultStyles = "rounded-md flex";

export const Button = ({variant,size,text,startIcon,endIcon,onClick,}: ButtonProps) => {
  return (
    <button
      type="button" onClick={onClick}
      className={`${variantStyles[variant]} ${sizeStyles[size]} ${defaultStyles}`}>
      {startIcon ? <div className="pr-2">{startIcon}</div> : null}
      {text}
      {endIcon}
    </button>
  );
};
