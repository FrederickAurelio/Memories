import { Dispatch, SetStateAction } from "react";

type TypeInput<T> = {
  placeholder: string;
  id: string;
  setFormData: Dispatch<SetStateAction<T>>;
  formData: T;
  errors: Record<string, string> | undefined;
} & React.InputHTMLAttributes<HTMLInputElement>;

function Input<T extends Record<string, string>>({
  placeholder,
  id,
  className,
  setFormData,
  formData,
  errors,
  ...rest
}: TypeInput<T>) {
  return (
    <div className="flex flex-col">
      <label className="text-neutral-500" htmlFor={id}>
        {placeholder}
      </label>
      <input
        name={id}
        id={id}
        className={`w-full rounded-lg border-2 border-neutral-300 p-2 text-lg ${className}`}
        value={formData[id] || ""}
        onChange={(e) => {
          setFormData((prevState) => {
            return { ...prevState, [id]: e.target.value };
          });
        }}
        {...rest}
      />
      <span className="text-sm text-rose-700">{errors ? errors[id] : ""}</span>
    </div>
  );
}

export default Input;
