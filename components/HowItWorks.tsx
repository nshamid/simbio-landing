const steps = [
  {
    n: "1",
    title: "Daftar & pilih peran",
    desc: "Gabung sebagai pengajar atau pelajar, lalu lengkapi profil singkatmu.",
  },
  {
    n: "2",
    title: "Ajukan atau cari kelas",
    desc: "Pengajar mengajukan kelas untuk dikurasi, pelajar mencari kelas yang sesuai.",
  },
  {
    n: "3",
    title: "Kelas berlangsung dengan aman",
    desc: "Pembayaran ditahan platform sampai kelas selesai tanpa laporan masalah.",
  },
  {
    n: "4",
    title: "Dapatkan hasilnya",
    desc: "Pengajar memperoleh penghasilan & pengalaman, pelajar memperoleh ilmu & badge.",
  },
];

export default function HowItWorks() {
  return (
    <section id="cara-kerja" className="mx-auto max-w-content px-6 py-20 sm:py-28">
      <div className="max-w-[520px]">
        <h2 className="font-display text-[28px] font-bold sm:text-[32px]">
          Cara kerja Simbio
        </h2>
        <p className="mt-3 text-[15px] leading-[1.6] text-ink/60">
          Empat langkah dari daftar sampai transaksi selesai, dirancang
          supaya kedua belah pihak sama-sama terlindungi.
        </p>
      </div>

      <div className="relative mt-14">
        <div className="grid gap-5 md:grid-cols-4">
          {steps.map((s) => (
            <div
              key={s.n}
              className="group rounded-[1.5rem] border border-ink/10 bg-white p-6 transition-all duration-300 ease-smooth hover:-translate-y-1.5 hover:border-ink/20 hover:shadow-[0_20px_40px_-20px_rgba(20,23,31,0.25)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink font-display text-[15px] font-bold text-white transition-colors duration-300 group-hover:bg-cobalt">
                {s.n}
              </div>
              <h3 className="mt-5 text-[15.5px] font-semibold text-ink">
                {s.title}
              </h3>
              <p className="mt-2 text-[13.5px] leading-[1.6] text-ink/60">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
