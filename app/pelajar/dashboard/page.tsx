"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppNav from "@/components/AppNav";
import { classKategori, classTileBidang } from "@/components/warna";
import {
  getAkun,
  getSeedKelas,
  statusWaktuKelas,
  formatRupiah,
  formatTanggal,
  formatJam,
  type Akun,
  type Kategori,
} from "@/lib/simbio-data";

const BIDANG_OPTIONS = [
  "UI/UX Design",
  "Pemrograman Web",
  "Bahasa",
  "Public Speaking",
  "Fotografi",
];

const KATEGORI_OPTIONS: Kategori[] = ["Dasar", "Menengah", "Mahir"];

export default function PelajarDashboardPage() {
  const router = useRouter();
  const [akun, setAkun] = useState<Akun | null>(null);
  const [checking, setChecking] = useState(true);

  const [bidangFilter, setBidangFilter] = useState<string[]>([]);
  const [kategoriFilter, setKategoriFilter] = useState<Kategori[]>([]);
  const [tanggalFilter, setTanggalFilter] = useState("");

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
    setChecking(false);
  }, [router]);

  const semuaKelas = useMemo(() => getSeedKelas(), []);

  const kelasTersaring = useMemo(() => {
    return semuaKelas.filter((k) => {
      if (bidangFilter.length > 0 && !bidangFilter.includes(k.bidang)) return false;
      if (kategoriFilter.length > 0 && !kategoriFilter.includes(k.kategori)) return false;
      if (tanggalFilter) {
        const tanggalKelas = new Date(k.jadwalMulai).toISOString().slice(0, 10);
        if (tanggalKelas !== tanggalFilter) return false;
      }
      return true;
    });
  }, [semuaKelas, bidangFilter, kategoriFilter, tanggalFilter]);

  function toggleBidang(b: string) {
    setBidangFilter((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );
  }

  function toggleKategori(k: Kategori) {
    setKategoriFilter((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]
    );
  }

  function resetFilter() {
    setBidangFilter([]);
    setKategoriFilter([]);
    setTanggalFilter("");
  }

  if (checking || !akun) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-canvas">
        <p className="text-[13.5px] text-ink/50">Memuat...</p>
      </main>
    );
  }

  const adaFilterAktif =
    bidangFilter.length > 0 || kategoriFilter.length > 0 || !!tanggalFilter;

  return (
    <main className="min-h-screen bg-canvas">
      <AppNav active="dashboard" />

      <div className="mx-auto max-w-[1180px] px-6 py-10">
        <h1 className="font-display text-[24px] font-bold text-ink">
          Cari kelas
        </h1>
        <p className="mt-1.5 text-[13.5px] text-ink/55">
          Halo {akun.nama}, ini kelas yang tersedia buat kamu ikuti.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
          {/* Filter */}
          <aside className="lg:border-r lg:border-ink/10 lg:pr-7">
            <div className="flex items-center justify-between">
              <h2 className="text-[12.5px] font-semibold uppercase tracking-wide text-ink/45">
                Filter
              </h2>
              {adaFilterAktif && (
                <button
                  onClick={resetFilter}
                  className="text-[12px] font-medium text-cobalt-deep hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="mt-4">
              <h3 className="text-[12.5px] font-semibold text-ink">Bidang</h3>
              <div className="mt-2 flex flex-col gap-2">
                {BIDANG_OPTIONS.map((b) => (
                  <label
                    key={b}
                    className="flex items-center gap-2 text-[13px] text-ink/70"
                  >
                    <input
                      type="checkbox"
                      checked={bidangFilter.includes(b)}
                      onChange={() => toggleBidang(b)}
                      className="accent-teal"
                    />
                    {b}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-[12.5px] font-semibold text-ink">Kategori</h3>
              <div className="mt-2 flex flex-col gap-2">
                {KATEGORI_OPTIONS.map((k) => (
                  <label
                    key={k}
                    className="flex items-center gap-2 text-[13px] text-ink/70"
                  >
                    <input
                      type="checkbox"
                      checked={kategoriFilter.includes(k)}
                      onChange={() => toggleKategori(k)}
                      className="accent-teal"
                    />
                    {k}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-[12.5px] font-semibold text-ink">Tanggal</h3>
              <input
                type="date"
                value={tanggalFilter}
                onChange={(e) => setTanggalFilter(e.target.value)}
                className="mt-2 w-full rounded-lg border border-ink/15 px-3 py-2 text-[13px] outline-none focus:border-cobalt"
              />
            </div>
          </aside>

          {/* Grid kelas */}
          <div>
            {kelasTersaring.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-ink/15 bg-white/60 p-10 text-center">
                <p className="text-[13.5px] text-ink/55">
                  Tidak ada kelas yang cocok dengan filter ini.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {kelasTersaring.map((k) => {
                  const status = statusWaktuKelas(k.jadwalMulai, k.durasiMenit);
                  return (
                    <Link
                      key={k.id}
                      href={`/pelajar/kelas/${k.id}`}
                      className="group rounded-[1.25rem] border border-ink/10 bg-white p-5 transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-[0_20px_40px_-22px_rgba(20,23,31,0.28)]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl text-[22px] ${classTileBidang(
                            k.bidang
                          )}`}
                        >
                          {k.icon}
                        </div>
                        <div className="flex flex-wrap justify-end gap-1.5">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${classKategori(
                              k.kategori
                            )}`}
                          >
                            {k.kategori}
                          </span>
                          {status === "berlangsung" && (
                            <span className="rounded-full bg-teal-tint px-2.5 py-1 text-[10.5px] font-semibold text-teal-deep">
                              Berlangsung
                            </span>
                          )}
                          {status === "selesai" && (
                            <span className="rounded-full bg-sand px-2.5 py-1 text-[10.5px] font-medium text-ink/50">
                              Selesai
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="mt-4 text-[14.5px] font-semibold leading-snug text-ink">
                        {k.judul}
                      </h3>
                      <p className="mt-1 text-[12px] text-ink/50">{k.pengajarNama}</p>

                      <div className="mt-3 text-[12px] text-ink/55">
                        {formatTanggal(k.jadwalMulai)} &middot; {formatJam(k.jadwalMulai)}
                      </div>

                      <div className="mt-3 font-display text-[15px] font-bold text-teal-deep">
                        {formatRupiah(k.harga)}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
