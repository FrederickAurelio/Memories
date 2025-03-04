type TypeInput = {
  placeholder: string;
  id: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

function Input({ placeholder, id, className, ...rest }: TypeInput) {
  return (
    <div className="flex flex-col">
      <label className="text-neutral-500" htmlFor={id}>
        {placeholder}
      </label>
      <input
        name={id}
        id={id}
        className={`w-full rounded-lg border-2 border-neutral-300 p-2 text-lg ${className}`}
        {...rest}
      />
    </div>
  );
}

export default Input;
