import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="mx-auto max-w-content px-6 pb-20 pt-16 md:pb-28 md:pt-24">
      <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        {/* Left: copy */}
        <div className="animate-rise-in">
          <h1 className="font-display text-[40px] font-bold leading-[1.08] tracking-[-0.01em] text-ink sm:text-[52px] lg:text-[58px]">
            Tempat ilmu dan kesempatan saling bertemu.
          </h1>
          <p className="mt-6 max-w-[440px] text-[16px] leading-[1.6] text-ink/65">
            Simbio mempertemukan orang yang ingin berbagi ilmu dengan orang
            yang ingin belajar secara personal — dengan kelas yang terkurasi
            dan pembayaran yang aman di setiap transaksi.
          </p>

          <div className="mt-5 flex items-center gap-2.5 text-[13px] font-semibold">
            <span className="text-teal-deep">Edukasi</span>
            <span className="text-ink/25">&middot;</span>
            <span className="text-cobalt-deep">Kolaborasi</span>
            <span className="text-ink/25">&middot;</span>
            <span className="text-teal-deep">Pertumbuhan</span>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-5">
            <Link
              href="/daftar"
              className="rounded-full bg-gradient-to-r from-teal to-cobalt px-7 py-3.5 text-[15px] font-semibold text-white transition-transform duration-300 ease-smooth hover:scale-105"
            >
              Daftar gratis
            </Link>
            <a
              href="#cara-kerja"
              className="border-b border-ink/25 pb-0.5 text-[15px] font-medium text-ink/75 hover:border-ink hover:text-ink"
            >
              Lihat cara kerja
            </a>
          </div>
        </div>

        {/* Right: visual panel grounded in real data */}
        <div className="animate-rise-in relative [animation-delay:180ms]">
          <div className="relative aspect-[3/2] w-full max-w-[560px] justify-self-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal via-teal to-cobalt sm:justify-self-end">
            <div className="absolute inset-0 flex items-center justify-center p-10">
              <Image
                src="/logo-icon-512.png"
                alt="Simbio"
                width={180}
                height={180}
                className="rounded-2xl opacity-95 drop-shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
              />
            </div>
          </div>

          <div className="absolute -left-3 top-8 w-[168px] rounded-2xl bg-white p-4 shadow-[0_18px_40px_-14px_rgba(20,23,31,0.22)] sm:-left-8">
            <div className="font-display text-[26px] font-bold text-cobalt">
              17,37%
            </div>
            <div className="mt-1 text-[12px] leading-snug text-ink/60">
              tingkat pengangguran usia muda di Indonesia
            </div>
          </div>

          <div className="absolute -right-2 bottom-8 w-[180px] rounded-2xl bg-white p-4 shadow-[0_18px_40px_-14px_rgba(20,23,31,0.22)] sm:-right-6">
            <div className="font-display text-[22px] font-bold text-teal-deep">
              Rp2jt–60jt
            </div>
            <div className="mt-1 text-[12px] leading-snug text-ink/60">
              kisaran biaya bootcamp konvensional
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
