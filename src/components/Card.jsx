export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-[--bg] border border-[--border] rounded-xl shadow-sm overflow-hidden flex flex-col h-full transition-shadow hover:shadow-md ${className}`}>
      {children}
    </div>
  );
}