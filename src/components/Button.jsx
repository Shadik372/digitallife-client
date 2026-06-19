export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[--accent] text-white hover:bg-[--accent-hover]",
    secondary: "bg-[--bg-secondary] text-[--text] border border-[--border] hover:brightness-95 dark:hover:brightness-110",
    outline: "border-2 border-[--accent] text-[--accent] hover:bg-[--accent] hover:text-white",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}