import Link from "next/link";

export default function RoleCTA() {
  return (
    <section id="gabung" className="grid sm:grid-cols-2">
      <div className="flex flex-col items-start justify-center bg-cobalt px-8 py-16 text-white sm:px-14 sm:py-24">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M4 19c0-3.3 3.6-5 8-5s8 1.7 8 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="8" r="3.4" stroke="#fff" strokeWidth="2" />
          </svg>
        </div>
        <h3 className="mt-5 font-display text-[26px] font-bold sm:text-[30px]">
          Jadi pengajar
        </h3>
        <p className="mt-3 max-w-[320px] text-[14.5px] leading-[1.6] text-white/75">
          Bagikan keahlianmu, bangun rekam jejak profesional, dan dapatkan
          penghasilan yang lebih stabil dari sekadar live streaming.
        </p>
        <Link href="/daftar"
          className="mt-7 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-cobalt-deep transition-transform duration-300 ease-smooth hover:scale-105"
        >
          Daftar sebagai pengajar
        </Link>
      </div>

      <div className="flex flex-col items-start justify-center bg-teal px-8 py-16 text-white sm:px-14 sm:py-24">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 6.5C6 5.2 9 5 12 6.2c3-1.2 6-1 8 .3v12c-2-1.3-5-1.5-8-.3-3-1.2-6-1-8 .3v-12z"
              stroke="#fff"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="mt-5 font-display text-[26px] font-bold sm:text-[30px]">
          Jadi pelajar
        </h3>
        <p className="mt-3 max-w-[320px] text-[14.5px] leading-[1.6] text-white/75">
          Cari kelas sesuai kebutuhanmu, belajar secara personal, dengan
          harga yang jauh lebih terjangkau dibanding bootcamp konvensional.
        </p>
        <Link href="/daftar"
          className="mt-7 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-teal-deep transition-transform duration-300 ease-smooth hover:scale-105"
        >
          Daftar sebagai pelajar
        </Link>
      </div>
    </section>
  );
}
