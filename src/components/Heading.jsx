export default function Heading({ level = 2, children, className = '' }) {
  const Tag = `h${level}`;
  
  const styles = {
    1: "text-4xl md:text-5xl font-bold tracking-tight text-[--text]",
    2: "text-2xl md:text-3xl font-semibold tracking-tight text-[--text]",
    3: "text-xl md:text-2xl font-semibold text-[--text]",
    4: "text-lg font-semibold text-[--text]"
  };

  return (
    <Tag className={`${styles[level]} ${className}`}>
      {children}
    </Tag>
  );
}