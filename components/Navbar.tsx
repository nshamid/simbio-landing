import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/[0.06] bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-content items-center justify-between px-6">
        <a href="#" className="flex items-center gap-2.5">
          <Image src="/logo-icon.png" alt="Simbio" width={30} height={23} priority />
          <span className="font-display text-[19px] font-bold text-ink">
            Simbio
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-[14.5px] text-ink/70 md:flex">
          <a href="#cara-kerja" className="hover:text-ink">
            Cara kerja
          </a>
          <a href="#keunggulan" className="hover:text-ink">
            Keunggulan
          </a>
          <a href="#gabung" className="hover:text-ink">
            Untuk pengajar
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/masuk"
            className="hidden text-[14px] font-medium text-ink/70 hover:text-ink sm:block"
          >
            Masuk
          </Link>
          <Link
            href="/daftar"
            className="rounded-full bg-gradient-to-r from-teal to-cobalt px-5 py-2.5 text-[14px] font-semibold text-white transition-transform duration-300 ease-smooth hover:scale-105"
          >
            Daftar
          </Link>
        </div>
      </div>
    </header>
  );
}
