export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-bold uppercase tracking-wide rounded-none border-2 border-(--border) transition-colors duration-150 active:translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none";

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const variants = {
    primary:
      "bg-(--accent) text-(--on-accent) hover:bg-(--text) hover:text-(--bg) hover:border-(--text)",

    outline:
      "bg-(--bg) text-(--text) hover:bg-(--text) hover:text-(--bg)",

    ghost:
      "border-transparent text-(--text-muted) hover:text-(--text) hover:bg-(--bg-secondary)",
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
