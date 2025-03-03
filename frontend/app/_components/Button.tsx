function Button({
  className,
  children,
  variant,
  ...rest
}: {
  className?: string;
  children?: React.ReactNode;
  variant: "primary" | "secondary";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`w-full rounded-full p-3 text-lg duration-100 hover:scale-105 ${variant === "primary" ? "bg-neutral-800 text-neutral-200" : ""} ${variant === "secondary" ? "border-2 border-neutral-800 bg-neutral-100 text-neutral-800" : ""} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
