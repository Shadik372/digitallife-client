import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t-2 border-(--border) mt-24">
      <div className="brutal-bar-accent" />
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-3 gap-12">

          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 bg-(--text) text-(--bg) flex items-center justify-center text-[10px] font-bold">
                DL
              </div>
              <h3 className="font-extrabold text-(--text)">
                Digital<span className="text-(--accent)">Life</span>
              </h3>
            </div>

            <p className="text-sm text-(--text-muted) leading-relaxed max-w-xs">
              Preserve experiences, share wisdom, and help others grow
              through life's lessons.
            </p>
          </div>

          <div>
            <h4 className="eyebrow mb-4">Explore</h4>

            <div className="flex flex-col gap-2.5 text-sm font-semibold">
              <Link href="/lessons" className="text-(--text-muted) hover:text-(--accent) transition-colors w-fit">Lessons</Link>
              <Link href="/pricing" className="text-(--text-muted) hover:text-(--accent) transition-colors w-fit">Pricing</Link>
            </div>
          </div>

          <div>
            <h4 className="eyebrow mb-4">Community</h4>

            <p className="text-sm text-(--text-muted) leading-relaxed max-w-xs">
              Learn from people who have already walked the road ahead.
            </p>
          </div>

        </div>

        <div className="border-t-2 border-(--border) mt-12 pt-6 text-sm text-(--text-muted) font-semibold">
          © {new Date().getFullYear()} DigitalLife. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
