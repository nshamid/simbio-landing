import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-canvas px-6 py-14">
      <div className="mx-auto flex max-w-content flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-[280px]">
          <div className="flex items-center gap-2.5">
            <Image src="/logo-icon.png" alt="Simbio" width={26} height={20} />
            <span className="font-display text-[16.5px] font-bold text-ink">
              Simbio
            </span>
          </div>
          <p className="mt-3 text-[13px] leading-[1.6] text-ink/55">
            Edukasi, Kolaborasi, dan Pertumbuhan.
          </p>
        </div>

        <div className="flex gap-16 text-[13.5px]">
          <div>
            <div className="font-semibold text-ink">Produk</div>
            <div className="mt-3 flex flex-col gap-2 text-ink/60">
              <a href="#cara-kerja" className="hover:text-ink">
                Cara kerja
              </a>
              <a href="#keunggulan" className="hover:text-ink">
                Keunggulan
              </a>
            </div>
          </div>
          <div>
            <div className="font-semibold text-ink">Mulai</div>
            <div className="mt-3 flex flex-col gap-2 text-ink/60">
              <a href="#gabung" className="hover:text-ink">
                Jadi pengajar
              </a>
              <a href="#gabung" className="hover:text-ink">
                Jadi pelajar
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-content border-t border-ink/10 pt-6 text-[12.5px] text-ink/45">
        © 2026 Simbio. Dibuat untuk SI FEST 2026.
      </div>
    </footer>
  );
}
