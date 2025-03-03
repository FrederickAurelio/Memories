type TypeInput = {
  placeholder: string;
  id: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

function Input({ placeholder, id, ...rest }: TypeInput) {
  return (
    <div className="flex flex-col">
      <label className="text-neutral-500" htmlFor={id}>
        {placeholder}
      </label>
      <input
        name={id}
        id={id}
        {...rest}
        className="w-full rounded-lg border-2 border-neutral-300 p-2 text-lg"
      />
    </div>
  );
}

export default Input;
