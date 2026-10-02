import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="bg-ink py-20 text-center text-white sm:py-28">
      <div className="mx-auto max-w-[520px] px-6">
        <h2 className="font-display text-[28px] font-bold sm:text-[34px]">
          Siap mulai belajar atau mengajar?
        </h2>
        <p className="mt-3 text-[15px] leading-[1.6] text-white/65">
          Gabung dengan Simbio dan jadi bagian dari ekosistem belajar-mengajar
          yang saling menguntungkan.
        </p>
        <Link
          href="/daftar"
          className="mt-8 inline-block rounded-full bg-gradient-to-r from-teal to-cobalt px-8 py-3.5 text-[15px] font-semibold text-white transition-transform duration-300 ease-smooth hover:scale-105"
        >
          Daftar sekarang
        </Link>
      </div>
    </section>
  );
}
