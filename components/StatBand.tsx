export default function StatBand() {
  return (
    <section className="bg-ink py-16 text-white sm:py-20">
      <div className="mx-auto max-w-content px-6">
        <h2 className="font-display text-[24px] font-bold sm:text-[28px]">
          Dua <span className="text-teal">masalah</span> yang mendorong
          lahirnya Simbio
        </h2>

        <div className="mt-10 grid gap-10 sm:grid-cols-2 sm:gap-0 sm:divide-x sm:divide-white/15">
          <div className="sm:pr-12">
            <div className="font-display text-[44px] font-bold leading-none sm:text-[52px]">
              17,37%
            </div>
            <p className="mt-4 max-w-[360px] text-[14.5px] leading-[1.6] text-white/65">
              Tingkat pengangguran usia muda di Indonesia (BPS, 2026),
              sementara banyak yang punya skill tapi belum punya saluran
              penghasilan yang stabil.
            </p>
          </div>
          <div className="sm:pl-12">
            <div className="font-display text-[44px] font-bold leading-none sm:text-[52px]">
              Rp2jt–60jt
            </div>
            <p className="mt-4 max-w-[360px] text-[14.5px] leading-[1.6] text-white/65">
              Kisaran biaya bootcamp konvensional, yang membuat belajar
              secara personal terasa mahal bagi banyak pelajar dan mahasiswa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
