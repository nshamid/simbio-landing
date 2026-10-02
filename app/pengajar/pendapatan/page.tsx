"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppNav from "@/components/AppNav";
import {
  getAkun,
  sinkronKelasPengajar,
  formatRupiah,
  formatTanggal,
  type Akun,
  type KelasPengajar,
} from "@/lib/simbio-data";

// Komisi platform per transaksi (persen). Ubah angka ini kalau mau
// mengganti skema komisi; semua perhitungan di halaman ini ikut berubah.
const KOMISI_PERSEN = 10;

type Rincian = {
  kelas: KelasPengajar;
  kotor: number;
  komisi: number;
  bersih: number;
  dicairkan: boolean;
};

export default function PendapatanPage() {
  const router = useRouter();
  const [akun, setAkun] = useState<Akun | null>(null);
  const [checking, setChecking] = useState(true);
  const [kelas, setKelas] = useState<KelasPengajar[]>([]);

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

  // Hanya kelas yang sudah disetujui yang menghasilkan pendapatan.
  const rincian: Rincian[] = useMemo(() => {
    return kelas
      .filter((k) =>
        ["disetujui_belum_mulai", "berlangsung", "selesai"].includes(k.statusPengajuan)
      )
      .map((k) => {
        const kotor = k.harga * k.jumlahPendaftar;
        const komisi = Math.round((kotor * KOMISI_PERSEN) / 100);
        return {
          kelas: k,
          kotor,
          komisi,
          bersih: kotor - komisi,
          dicairkan: k.statusPengajuan === "selesai",
        };
      })
      .sort(
        (a, b) =>
          new Date(b.kelas.jadwalMulai).getTime() - new Date(a.kelas.jadwalMulai).getTime()
      );
  }, [kelas]);

  const totalDiterima = rincian.filter((r) => r.dicairkan).reduce((s, r) => s + r.bersih, 0);
  const totalDitahan = rincian.filter((r) => !r.dicairkan).reduce((s, r) => s + r.bersih, 0);
  const totalPendaftar = rincian.reduce((s, r) => s + r.kelas.jumlahPendaftar, 0);

  if (checking || !akun) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-canvas">
        <p className="text-[13.5px] text-ink/50">Memuat...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-canvas">
      <AppNav active="pendapatan" />

      <div className="mx-auto max-w-[980px] px-6 py-10">
        <h1 className="font-display text-[24px] font-bold text-ink">Pendapatan</h1>
        <p className="mt-1.5 text-[13.5px] text-ink/55">
          Ringkasan pembayaran dari kelas-kelas yang kamu ajarkan, setelah
          dipotong komisi platform {KOMISI_PERSEN}%.
        </p>

        {rincian.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-ink/15 bg-white/60 p-10 text-center">
            <p className="mx-auto max-w-[380px] text-[13.5px] leading-[1.6] text-ink/55">
              Belum ada pendapatan. Pendapatan muncul setelah kelasmu disetujui
              tim Simbio dan ada pelajar yang mendaftar.
            </p>
            <Link
              href="/pengajar/dashboard"
              className="mt-3 inline-block text-[13.5px] font-semibold text-cobalt-deep hover:underline"
            >
              Ke dashboard
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.25rem] border border-ink/10 bg-white p-6">
                <div className="text-[12px] text-ink/50">Sudah diterima</div>
                <div className="mt-2 font-display text-[22px] font-bold text-teal-deep">
                  {formatRupiah(totalDiterima)}
                </div>
                <div className="mt-1 text-[11.5px] text-ink/40">Dari kelas yang sudah selesai</div>
              </div>
              <div className="rounded-[1.25rem] border border-ink/10 bg-white p-6">
                <div className="text-[12px] text-ink/50">Ditahan (escrow)</div>
                <div className="mt-2 font-display text-[22px] font-bold text-cobalt-deep">
                  {formatRupiah(totalDitahan)}
                </div>
                <div className="mt-1 text-[11.5px] text-ink/40">Cair setelah kelas selesai</div>
              </div>
              <div className="rounded-[1.25rem] border border-ink/10 bg-white p-6">
                <div className="text-[12px] text-ink/50">Total pendaftar</div>
                <div className="mt-2 font-display text-[22px] font-bold text-ink">
                  {totalPendaftar}
                </div>
                <div className="mt-1 text-[11.5px] text-ink/40">Dari semua kelas disetujui</div>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-cobalt-tint px-4 py-3 text-[12.5px] leading-[1.55] text-cobalt-deep">
              Dana pelajar ditahan platform sampai kelas selesai tanpa laporan
              masalah, baru diteruskan kepadamu.
            </div>

            <h2 className="mt-9 text-[14.5px] font-semibold text-ink">Rincian per kelas</h2>
            <div className="mt-4 space-y-3">
              {rincian.map((r) => (
                <div
                  key={r.kelas.id}
                  className="rounded-[1.25rem] border border-ink/10 bg-white p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-canvas text-[20px]">
                        {r.kelas.icon}
                      </div>
                      <div>
                        <h3 className="text-[14px] font-semibold leading-snug text-ink">
                          {r.kelas.judul}
                        </h3>
                        <p className="mt-0.5 text-[12px] text-ink/50">
                          {formatTanggal(r.kelas.jadwalMulai)} &middot; {r.kelas.jumlahPendaftar} pendaftar
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${
                        r.dicairkan ? "bg-teal-tint text-teal-deep" : "bg-cobalt-tint text-cobalt-deep"
                      }`}
                    >
                      {r.dicairkan ? "Dicairkan" : "Ditahan"}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 border-t border-ink/8 pt-4 text-[12.5px]">
                    <div>
                      <div className="text-ink/45">Pendapatan kotor</div>
                      <div className="mt-0.5 font-medium text-ink">{formatRupiah(r.kotor)}</div>
                    </div>
                    <div>
                      <div className="text-ink/45">Komisi ({KOMISI_PERSEN}%)</div>
                      <div className="mt-0.5 font-medium text-ink">-{formatRupiah(r.komisi)}</div>
                    </div>
                    <div>
                      <div className="text-ink/45">Yang kamu terima</div>
                      <div className="mt-0.5 font-display text-[14px] font-bold text-teal-deep">
                        {formatRupiah(r.bersih)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
