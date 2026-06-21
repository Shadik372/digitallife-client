export default function RoleBadge({ role, isPremium }) {
  const styles = {
    admin:
      "bg-red-500/10 text-red-500 border border-red-500/20",

    seller:
      "bg-[--accent]/10 text-[--accent] border border-[--accent]/20",
  };

  if (role === "admin") {
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${styles.admin}`}>
        Admin
      </span>
    );
  }

  if (role === "seller") {
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${styles.seller}`}>
        Contributor
      </span>
    );
  }

  if (isPremium) {
    return (
      <span className="px-2 py-1 rounded-full text-xs bg-amber-500/10 text-amber-500 border border-amber-500/20">
        Premium
      </span>
    );
  }

  return null;
}