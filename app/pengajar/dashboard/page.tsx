"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppNav from "@/components/AppNav";
import {
  getAkun,
  sinkronKelasPengajar,
  getKelasPengajar,
  simpanKelasPengajar,
  formatRupiah,
  formatTanggal,
  formatJam,
  KEY_TOS,
  tandaiAktifSejak,
  type Akun,
  type KelasPengajar,
  type StatusPengajuan,
} from "@/lib/simbio-data";

const URUTAN_SEKSI: { status: StatusPengajuan; judul: string }[] = [
  { status: "berlangsung", judul: "Sedang berlangsung" },
  { status: "disetujui_belum_mulai", judul: "Disetujui, belum berlangsung" },
  { status: "menunggu", judul: "Menunggu persetujuan" },
  { status: "selesai", judul: "Selesai" },
  { status: "ditolak", judul: "Tidak disetujui" },
];

export default function PengajarDashboardPage() {
  const router = useRouter();
  const [akun, setAkun] = useState<Akun | null>(null);
  const [checking, setChecking] = useState(true);
  const [kelas, setKelas] = useState<KelasPengajar[]>([]);
  const [showTos, setShowTos] = useState(false);
  const [tosChecked, setTosChecked] = useState(false);

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
    if (data.peran !== "pengajar") {
      router.replace("/pelajar/dashboard");
      return;
    }
    setAkun(data);
    setKelas(sinkronKelasPengajar());
    setChecking(false);
  }, [router]);

  // Klik "Ajukan Kelas": kalau ToS belum pernah disetujui, tampilkan popup dulu.
  function handleAjukan() {
    if (localStorage.getItem(KEY_TOS)) {
      router.push("/pengajar/ajukan-kelas");
    } else {
      setTosChecked(false);
      setShowTos(true);
    }
  }

  function handleSetujuTos() {
    localStorage.setItem(KEY_TOS, "true");
    setShowTos(false);
    router.push("/pengajar/ajukan-kelas");
  }

  // Simulasi keputusan tim Simbio (khusus demo, karena belum ada admin).
  function handleKeputusanDemo(id: string, setuju: boolean) {
    const semua = getKelasPengajar();
    const updated: KelasPengajar[] = semua.map((k) => {
      if (k.id !== id) return k;
      if (!setuju) return { ...k, statusPengajuan: "ditolak" };
      return {
        ...k,
        statusPengajuan: "disetujui_belum_mulai",
        // Jumlah pendaftar & review bintang 5 disimulasikan, dipakai
        // di halaman Pendapatan dan Target.
        jumlahPendaftar: Math.floor(Math.random() * 8) + 3,
        reviewBintang5: Math.floor(Math.random() * 4),
      };
    });
    simpanKelasPengajar(updated);
    if (setuju) tandaiAktifSejak();
    setKelas(sinkronKelasPengajar());
  }

  if (checking || !akun) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-canvas">
        <p className="text-[13.5px] text-ink/50">Memuat...</p>
      </main>
    );
  }

  const kosong = kelas.length === 0;

  return (
    <main className="min-h-screen bg-canvas">
      <AppNav active="dashboard" />

      <div className="mx-auto max-w-[1180px] px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-[24px] font-bold text-ink">Dashboard</h1>
            <p className="mt-1.5 text-[13.5px] text-ink/55">
              Halo {akun.nama}, kelola kelas yang kamu ajukan di sini.
            </p>
          </div>
          {!kosong && (
            <button
              onClick={handleAjukan}
              className="shrink-0 rounded-full bg-gradient-to-r from-teal to-cobalt px-6 py-2.5 text-[13.5px] font-semibold text-white transition-transform duration-300 ease-smooth hover:scale-105"
            >
              + Ajukan Kelas
            </button>
          )}
        </div>

        {kosong ? (
          <div className="mt-10 flex flex-col items-center rounded-[1.75rem] border border-dashed border-ink/15 bg-white/60 px-6 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cobalt-tint text-[28px]">
              🧑‍🏫
            </div>
            <h2 className="mt-5 font-display text-[20px] font-bold text-ink">
              Belum ada kelas
            </h2>
            <p className="mt-2 max-w-[360px] text-[13.5px] leading-[1.6] text-ink/55">
              Mulai bagikan ilmumu. Ajukan kelas pertamamu dan tim Simbio akan
              meninjaunya dalam maksimal 2×24 jam.
            </p>
            <button
              onClick={handleAjukan}
              className="mt-6 rounded-full bg-gradient-to-r from-teal to-cobalt px-8 py-3 text-[14px] font-semibold text-white transition-transform duration-300 ease-smooth hover:scale-105"
            >
              Ajukan Kelas
            </button>
          </div>
        ) : (
          <div className="mt-8">
            {URUTAN_SEKSI.map(({ status, judul }) => {
              const items = kelas.filter((k) => k.statusPengajuan === status);
              if (items.length === 0) return null;
              return (
                <div key={status} className="mb-10">
                  <h2 className="mb-4 text-[14.5px] font-semibold text-ink">
                    {judul} <span className="text-ink/40">({items.length})</span>
                  </h2>
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {items.map((k) => (
                      <div
                        key={k.id}
                        className="rounded-[1.25rem] border border-ink/10 bg-white p-5"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-canvas text-[22px]">
                            {k.icon}
                          </div>
                          {status === "menunggu" && (
                            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10.5px] font-semibold text-amber-700">
                              Menunggu
                            </span>
                          )}
                          {status === "berlangsung" && (
                            <span className="rounded-full bg-teal-tint px-2.5 py-1 text-[10.5px] font-semibold text-teal-deep">
                              Berlangsung
                            </span>
                          )}
                          {status === "disetujui_belum_mulai" && (
                            <span className="rounded-full bg-cobalt-tint px-2.5 py-1 text-[10.5px] font-semibold text-cobalt-deep">
                              Disetujui
                            </span>
                          )}
                          {status === "selesai" && (
                            <span className="rounded-full bg-sand px-2.5 py-1 text-[10.5px] font-medium text-ink/50">
                              Selesai
                            </span>
                          )}
                          {status === "ditolak" && (
                            <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10.5px] font-semibold text-red-600">
                              Ditolak
                            </span>
                          )}
                        </div>

                        <h3 className="mt-4 text-[14.5px] font-semibold leading-snug text-ink">
                          {k.judul}
                        </h3>
                        <p className="mt-1 text-[12px] text-ink/50">
                          {k.bidang} &middot; {k.kategori}
                        </p>
                        <div className="mt-3 text-[12px] text-ink/55">
                          {formatTanggal(k.jadwalMulai)} &middot; {formatJam(k.jadwalMulai)}
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="font-display text-[14px] font-bold text-teal-deep">
                            {formatRupiah(k.harga)}
                          </span>
                          {status !== "menunggu" && status !== "ditolak" && (
                            <span className="text-[12px] text-ink/50">
                              {k.jumlahPendaftar} pendaftar
                            </span>
                          )}
                        </div>

                        {status === "ditolak" && (
                          <p className="mt-3 text-[12px] leading-[1.5] text-ink/50">
                            Kelas ini belum memenuhi standar kurasi Simbio.
                          </p>
                        )}

                        {status === "menunggu" && (
                          <div className="mt-4 border-t border-ink/8 pt-3">
                            <p className="text-[11px] text-ink/40">
                              Demo: simulasi keputusan tim Simbio
                            </p>
                            <div className="mt-2 flex gap-2">
                              <button
                                onClick={() => handleKeputusanDemo(k.id, true)}
                                className="rounded-full bg-teal-tint px-3.5 py-1.5 text-[12px] font-semibold text-teal-deep hover:opacity-80"
                              >
                                Setujui
                              </button>
                              <button
                                onClick={() => handleKeputusanDemo(k.id, false)}
                                className="rounded-full bg-red-50 px-3.5 py-1.5 text-[12px] font-semibold text-red-600 hover:opacity-80"
                              >
                                Tolak
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Popup Syarat & Ketentuan (muncul sekali, saat pertama kali ajukan kelas) */}
      {showTos && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-6">
          <div className="max-h-[90vh] w-full max-w-[480px] overflow-y-auto rounded-[1.75rem] bg-white p-8">
            <h2 className="font-display text-[20px] font-bold text-ink">
              Syarat &amp; Ketentuan Pengajar
            </h2>
            <p className="mt-1.5 text-[13px] text-ink/55">
              Baca dan setujui sebelum mengajukan kelas pertamamu.
            </p>

            <ul className="mt-5 space-y-3 text-[13px] leading-[1.6] text-ink/70">
              <li>
                <span className="font-semibold text-ink">Kurasi kelas.</span>{" "}
                Setiap kelas ditinjau tim Simbio (maksimal 2×24 jam) untuk
                menentukan kategori, tarif, dan memastikan standar kualitas.
              </li>
              <li>
                <span className="font-semibold text-ink">Komisi platform.</span>{" "}
                Simbio memperoleh komisi berupa persentase kecil dari setiap
                transaksi pembayaran pelajar.
              </li>
              <li>
                <span className="font-semibold text-ink">Pembayaran aman.</span>{" "}
                Dana pelajar ditahan platform dan diteruskan kepadamu setelah
                kelas selesai tanpa laporan masalah.
              </li>
              <li>
                <span className="font-semibold text-ink">Rekaman kelas.</span>{" "}
                Setiap sesi direkam untuk keperluan evaluasi dan penanganan
                laporan, dan tidak disebarluaskan tanpa persetujuan.
              </li>
              <li>
                <span className="font-semibold text-ink">Tindakan.</span>{" "}
                Jika terbukti terjadi pelanggaran, Simbio dapat menahan
                pendapatan kelas terkait atau mencabut hak mengajar.
              </li>
            </ul>

            <label className="mt-6 flex cursor-pointer items-start gap-2.5 text-[13px] text-ink">
              <input
                type="checkbox"
                checked={tosChecked}
                onChange={(e) => setTosChecked(e.target.checked)}
                className="mt-0.5 accent-teal"
              />
              Saya telah membaca dan menyetujui syarat &amp; ketentuan di atas.
            </label>

            <button
              onClick={handleSetujuTos}
              disabled={!tosChecked}
              className="mt-6 w-full rounded-full bg-gradient-to-r from-teal to-cobalt py-3 text-[14px] font-semibold text-white transition-transform duration-300 ease-smooth hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            >
              Setuju &amp; Lanjutkan
            </button>
            <button
              onClick={() => setShowTos(false)}
              className="mt-2 w-full rounded-full border border-ink/15 py-3 text-[14px] font-semibold text-ink/70 hover:border-ink/30 hover:text-ink"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
