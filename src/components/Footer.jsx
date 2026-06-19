import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[--bg-secondary] border-t border-[--border] py-8 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div className="flex flex-col items-center md:items-start">
          <span className="text-lg font-bold text-[--text]">Digital Life Lessons</span>
          <span className="text-sm text-[--text-muted] mt-1">Preserving personal wisdom.</span>
        </div>

        <div className="flex gap-6 text-sm text-[--text-muted]">
          <Link href="/terms" className="hover:text-[--text] transition-colors">Terms & Conditions</Link>
          <a href="mailto:contact@digitallifelessons.com" className="hover:text-[--text] transition-colors">Contact Us</a>
        </div>

        <div className="flex gap-4">
          {/* New X Logo SVG */}
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-[--text-muted] hover:text-[--text] transition-colors">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>
        
      </div>
    </footer>
  );
}