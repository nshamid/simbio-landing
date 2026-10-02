function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Features() {
  return (
    <section id="keunggulan" className="mx-auto max-w-content px-6 pt-8 pb-20 sm:pt-12 sm:pb-28">
      <div className="max-w-[520px]">
        <h2 className="font-display text-[28px] font-bold sm:text-[32px]">
          Kenapa Simbio
        </h2>
        <p className="mt-3 text-[15px] leading-[1.6] text-ink/60">
          Dibangun untuk menjawab hal yang sering hilang di belajar-mengajar
          informal: kepercayaan dan kepastian.
        </p>
      </div>

      <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-[1.6fr_1fr]">
        {/* Featured */}
        <div className="rounded-[1.75rem] bg-ink p-9 text-white">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white">
            <ShieldIcon />
          </div>
          <h3 className="mt-6 font-display text-[22px] font-bold">
            Pembayaran aman dengan escrow
          </h3>
          <p className="mt-3 max-w-[440px] text-[14.5px] leading-[1.65] text-white/65">
            Uang pelajar ditahan platform sampai kelas selesai tanpa laporan
            masalah, baru diteruskan ke pengajar. Kedua belah pihak
            sama-sama punya jaminan sebelum transaksi rampung.
          </p>
        </div>

        {/* Small features — stacked to match featured card's height */}
        <div className="flex flex-col gap-5">
          <div className="flex-1 rounded-[1.5rem] border border-ink/10 bg-white p-6">
            <h3 className="text-[15.5px] font-semibold">Kelas terkurasi</h3>
            <p className="mt-2 text-[13.5px] leading-[1.6] text-ink/60">
              Setiap kelas ditinjau tim Simbio sebelum tayang, jadi
              kualitasnya terjaga.
            </p>
          </div>
          <div className="flex-1 rounded-[1.5rem] border border-ink/10 bg-white p-6">
            <h3 className="text-[15.5px] font-semibold">
              Badge & rekam jejak
            </h3>
            <p className="mt-2 text-[13.5px] leading-[1.6] text-ink/60">
              Pengajar membangun reputasi yang bisa jadi bekal portofolio
              profesional.
            </p>
          </div>
          <div className="flex-1 rounded-[1.5rem] border border-ink/10 bg-white p-6">
            <h3 className="text-[15.5px] font-semibold">Harga terjangkau</h3>
            <p className="mt-2 text-[13.5px] leading-[1.6] text-ink/60">
              Jauh di bawah bootcamp konvensional, karena kelasnya personal
              dan fleksibel sesuai kebutuhanmu.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
