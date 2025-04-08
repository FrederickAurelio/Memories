function Button({
  className,
  children,
  variant,
  size = "normal",
  ...rest
}: {
  className?: string;
  children?: React.ReactNode;
  variant: "primary" | "secondary";
  size?: "small" | "normal";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`w-full rounded-full text-lg duration-100 hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100 ${variant === "primary" ? "bg-neutral-800 text-neutral-200 disabled:bg-neutral-600" : ""} ${variant === "secondary" ? "border-2 border-neutral-800 bg-neutral-100 text-neutral-800 disabled:border-neutral-600 disabled:text-neutral-600" : ""} ${size === "small" ? "p-0" : "p-3"} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
