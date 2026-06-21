export default function Heading({ level = 2, children, className = '' }) {
  const Tag = `h${level}`;

  const styles = {
    1: "text-5xl md:text-7xl font-extrabold tracking-tight leading-[0.95] text-(--text)",
    2: "text-3xl md:text-4xl font-extrabold tracking-tight text-(--text)",
    3: "text-xl md:text-2xl font-bold tracking-tight text-(--text)",
    4: "text-lg font-bold text-(--text)"
  };

  return (
    <Tag className={`${styles[level]} ${className}`}>
      {children}
    </Tag>
  );
}
