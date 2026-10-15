import { forwardRef } from "react";

interface InputProps {
  placeholder: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ placeholder }, ref) => {
    return (
      <div>
        <input
          ref={ref}
          placeholder={placeholder}
          type="text"
          className="px-4 py-2 border rounded  outline-none border-gray-200 w-full"
        />
      </div>
    );
  },
);

export default Input;
