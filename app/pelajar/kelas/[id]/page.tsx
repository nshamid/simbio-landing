"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppNav from "@/components/AppNav";
import {
  getAkun,
  getSeedKelas,
  getAktivitas,
  simpanAktivitas,
  statusWaktuKelas,
  formatRupiah,
  formatTanggal,
  formatJam,
  type Akun,
  type AktivitasItem,
} from "@/lib/simbio-data";

export default function DetailKelasPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const kelasId = params.id;

  const [akun, setAkun] = useState<Akun | null>(null);
  const [checking, setChecking] = useState(true);
  const [aktivitasList, setAktivitasList] = useState<AktivitasItem[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [berhasilDaftar, setBerhasilDaftar] = useState(false);

  const [ratingInput, setRatingInput] = useState(0);
  const [komentarInput, setKomentarInput] = useState("");
  const [errorUlasan, setErrorUlasan] = useState("");

  useEffect(() => {
    const data = getAkun();
    if (!data) {
      router.replace("/daftar");
      return;
    }
    if (!data.profilLengkap) {
      router.replace("/lengkapi-profil");
      return;
    }
    if (data.peran !== "pelajar") {
      router.replace("/pengajar/dashboard");
      return;
    }
    setAkun(data);
    setAktivitasList(getAktivitas());
    setChecking(false);
  }, [router]);

  const kelas = useMemo(
    () => getSeedKelas().find((k) => k.id === kelasId),
    [kelasId]
  );

  const myAktivitas = aktivitasList.find((a) => a.kelasId === kelasId);
  const statusKelas = kelas ? statusWaktuKelas(kelas.jadwalMulai, kelas.durasiMenit) : "akan_datang";

  function handleSelesaiBayar() {
    if (!kelas) return;
    const baru: AktivitasItem = {
      kelasId: kelas.id,
      status: statusKelas === "berlangsung" ? "berlangsung" : "diikuti",
      waktuDaftar: new Date().toISOString(),
      sudahBayar: true,
    };
    const updated = [...aktivitasList.filter((a) => a.kelasId !== kelas.id), baru];
    simpanAktivitas(updated);
    setAktivitasList(updated);
    setShowPayment(false);
    setBerhasilDaftar(true);
  }

  function handleKirimUlasan() {
    if (!kelas) return;
    if (ratingInput === 0) {
      setErrorUlasan("Kasih rating bintang dulu, ya.");
      return;
    }
    if (!komentarInput.trim()) {
      setErrorUlasan("Tulis sedikit ulasanmu dulu.");
      return;
    }
    setErrorUlasan("");
    const updated = aktivitasList.map((a) =>
      a.kelasId === kelas.id
        ? { ...a, ulasan: { rating: ratingInput, komentar: komentarInput.trim() } }
        : a
    );
    simpanAktivitas(updated);
    setAktivitasList(updated);
  }

  if (checking || !akun) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-canvas">
        <p className="text-[13.5px] text-ink/50">Memuat...</p>
      </main>
    );
  }

  if (!kelas) {
    return (
      <main className="min-h-screen bg-canvas">
        <AppNav active="dashboard" />
        <div className="mx-auto max-w-[1180px] px-6 py-16 text-center">
          <p className="text-[14px] text-ink/60">Kelas tidak ditemukan.</p>
          <Link href="/pelajar/dashboard" className="mt-3 inline-block text-[13.5px] font-semibold text-cobalt-deep">
            Kembali ke pencarian kelas
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-canvas">
      <AppNav active="dashboard" />

      <div className="mx-auto max-w-[1180px] px-6 py-10">
        <Link href="/pelajar/dashboard" className="text-[13px] font-medium text-ink/50 hover:text-ink">
          ← Kembali ke pencarian kelas
        </Link>

        <div className="mt-4 flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-[26px]">
            {kelas.icon}
          </div>
          <div>
            <h1 className="font-display text-[24px] font-bold leading-tight text-ink">
              {kelas.judul}
            </h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[12.5px]">
              <span className="rounded-full bg-teal-tint px-2.5 py-1 font-semibold text-teal-deep">
                {kelas.kategori}
              </span>
              <span className="text-ink/50">{kelas.bidang}</span>
              {statusKelas === "berlangsung" && (
                <span className="rounded-full bg-cobalt-tint px-2.5 py-1 font-semibold text-cobalt-deep">
                  Sedang berlangsung
                </span>
              )}
              {statusKelas === "selesai" && (
                <span className="rounded-full bg-sand px-2.5 py-1 font-medium text-ink/50">
                  Selesai
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          {/* Info kelas */}
          <div>
            <div className="rounded-[1.5rem] border border-ink/10 bg-white p-7">
              <h2 className="text-[14.5px] font-semibold text-ink">Tentang kelas ini</h2>
              <p className="mt-2.5 text-[13.5px] leading-[1.65] text-ink/65">
                {kelas.output}
              </p>

              <div className="mt-6 grid gap-3 text-[13px] sm:grid-cols-2">
                <div className="flex justify-between border-b border-ink/8 pb-2.5">
                  <span className="text-ink/50">Tanggal</span>
                  <span className="font-medium text-ink">{formatTanggal(kelas.jadwalMulai)}</span>
                </div>
                <div className="flex justify-between border-b border-ink/8 pb-2.5">
                  <span className="text-ink/50">Jam</span>
                  <span className="font-medium text-ink">{formatJam(kelas.jadwalMulai)}</span>
                </div>
                <div className="flex justify-between border-b border-ink/8 pb-2.5">
                  <span className="text-ink/50">Durasi</span>
                  <span className="font-medium text-ink">{kelas.durasiMenit} menit</span>
                </div>
                <div className="flex justify-between border-b border-ink/8 pb-2.5">
                  <span className="text-ink/50">Media</span>
                  <span className="text-right font-medium text-ink">{kelas.media.join(", ")}</span>
                </div>
              </div>
            </div>

            {/* Area ulasan / status keikutsertaan */}
            {myAktivitas && statusKelas === "selesai" && (
              <div className="mt-5 rounded-[1.5rem] border border-ink/10 bg-white p-7">
                {myAktivitas.ulasan ? (
                  <div>
                    <h2 className="text-[14.5px] font-semibold text-ink">Ulasan kamu</h2>
                    <div className="mt-2 text-[18px] text-amber-500">
                      {"★".repeat(myAktivitas.ulasan.rating)}
                      <span className="text-ink/15">
                        {"★".repeat(5 - myAktivitas.ulasan.rating)}
                      </span>
                    </div>
                    <p className="mt-2 text-[13.5px] leading-[1.6] text-ink/65">
                      {myAktivitas.ulasan.komentar}
                    </p>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-[14.5px] font-semibold text-ink">
                      Kelas ini sudah selesai — beri ulasan
                    </h2>
                    <div className="mt-3 flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setRatingInput(n)}
                          className={`text-[26px] leading-none ${
                            n <= ratingInput ? "text-amber-500" : "text-ink/15"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={komentarInput}
                      onChange={(e) => setKomentarInput(e.target.value)}
                      placeholder="Ceritakan pengalaman belajarmu di kelas ini..."
                      rows={3}
                      className="mt-3 w-full resize-none rounded-xl border border-ink/15 px-4 py-2.5 text-[13.5px] leading-[1.5] outline-none focus:border-cobalt"
                    />
                    {errorUlasan && (
                      <p className="mt-2 text-[12px] font-medium text-red-500">{errorUlasan}</p>
                    )}
                    <button
                      onClick={handleKirimUlasan}
                      className="mt-3 rounded-full bg-gradient-to-r from-teal to-cobalt px-6 py-2.5 text-[13.5px] font-semibold text-white transition-transform duration-300 ease-smooth hover:scale-[1.02]"
                    >
                      Kirim Ulasan
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar: pengajar + aksi */}
          <div className="rounded-[1.5rem] border border-ink/10 bg-white p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sand text-[13px] font-semibold text-ink/60">
                {kelas.pengajarNama.charAt(0)}
              </div>
              <div>
                <div className="text-[13.5px] font-semibold text-ink">{kelas.pengajarNama}</div>
                <div className="text-[12px] text-ink/50">
                  ★ {kelas.pengajarRating} &middot; {kelas.pengajarJumlahKelas} kelas
                </div>
              </div>
            </div>

            <div className="my-5 h-px bg-ink/8" />

            <div className="flex items-baseline justify-between">
              <span className="text-[13px] text-ink/50">Harga</span>
              <span className="font-display text-[20px] font-bold text-teal-deep">
                {formatRupiah(kelas.harga)}
              </span>
            </div>

            {/* --- Logika aksi --- */}
            <div className="mt-5">
              {!myAktivitas && statusKelas !== "selesai" && !showPayment && !berhasilDaftar && (
                <button
                  onClick={() => setShowPayment(true)}
                  className="w-full rounded-full bg-gradient-to-r from-teal to-cobalt py-3 text-[14px] font-semibold text-white transition-transform duration-300 ease-smooth hover:scale-[1.02]"
                >
                  Daftar & Bayar
                </button>
              )}

              {showPayment && (
                <div>
                  <h3 className="text-[12.5px] font-semibold text-ink/70">
                    Pilih metode pembayaran
                  </h3>
                  <div className="mt-2.5 flex cursor-not-allowed items-center justify-between rounded-xl border-2 border-teal bg-teal-tint px-4 py-2.5 text-[13px]">
                    QRIS
                    <span className="h-4 w-4 rounded-full border-2 border-teal bg-teal" />
                  </div>
                  <div className="mt-2 flex cursor-not-allowed items-center justify-between rounded-xl border border-ink/15 px-4 py-2.5 text-[13px] text-ink/40">
                    Transfer Bank
                    <span className="h-4 w-4 rounded-full border-2 border-ink/15" />
                  </div>
                  <p className="mt-2.5 text-[11.5px] leading-[1.5] text-ink/40">
                    Demo — metode pembayaran belum bisa diklik/diganti.
                  </p>

                  <button
                    onClick={handleSelesaiBayar}
                    className="mt-4 w-full rounded-full bg-gradient-to-r from-teal to-cobalt py-3 text-[14px] font-semibold text-white transition-transform duration-300 ease-smooth hover:scale-[1.02]"
                  >
                    Selesai
                  </button>
                  <button
                    onClick={() => setShowPayment(false)}
                    className="mt-2 w-full rounded-full border border-ink/15 py-3 text-[14px] font-semibold text-ink/70 hover:border-ink/30 hover:text-ink"
                  >
                    Batalkan
                  </button>
                </div>
              )}

              {(myAktivitas || berhasilDaftar) && statusKelas !== "selesai" && !showPayment && (
                <div className="rounded-xl bg-teal-tint p-4 text-[13px] leading-[1.55] text-teal-deep">
                  {statusKelas === "berlangsung"
                    ? "Kelas sedang berlangsung. Link Zoom (demo) tersedia di sini."
                    : "Kamu terdaftar di kelas ini. Link Zoom akan tampil 10 menit sebelum kelas dimulai."}
                  <div className="mt-3">
                    <Link href="/pelajar/aktivitas" className="text-[12.5px] font-semibold underline">
                      Lihat di Aktivitas
                    </Link>
                  </div>
                </div>
              )}

              {!myAktivitas && statusKelas === "selesai" && (
                <p className="text-[12.5px] leading-[1.55] text-ink/45">
                  Kelas ini sudah selesai. Pendaftaran ditutup.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
