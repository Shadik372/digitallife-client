export default function RoleBadge({ role, isPremium }) {
  if (role === "admin") {
    return <span className="bg-red-100 text-red-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Admin 🛡️</span>;
  }
  if (role === "seller") {
    return <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Seller 🏪</span>;
  }
  if (isPremium) {
    return <span className="bg-yellow-100 text-yellow-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Premium ⭐</span>;
  }
  return null; // Regular free buyers don't strictly need a badge in the UI
}