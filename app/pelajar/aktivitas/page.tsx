"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppNav from "@/components/AppNav";
import { classKategori, classTileBidang } from "@/components/warna";
import {
  getAkun,
  getSeedKelas,
  sinkronAktivitas,
  formatRupiah,
  formatTanggal,
  formatJam,
  type Akun,
  type AktivitasItem,
  type Kelas,
} from "@/lib/simbio-data";

type Gabungan = AktivitasItem & { kelas: Kelas };

export default function AktivitasPage() {
  const router = useRouter();
  const [akun, setAkun] = useState<Akun | null>(null);
  const [checking, setChecking] = useState(true);
  const [aktivitas, setAktivitas] = useState<AktivitasItem[]>([]);

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
    setAktivitas(sinkronAktivitas());
    setChecking(false);
  }, [router]);

  const semuaKelas = useMemo(() => getSeedKelas(), []);

  const gabungan: Gabungan[] = useMemo(() => {
    return aktivitas
      .map((a) => {
        const kelas = semuaKelas.find((k) => k.id === a.kelasId);
        return kelas ? { ...a, kelas } : null;
      })
      .filter((x): x is Gabungan => x !== null);
  }, [aktivitas, semuaKelas]);

  const diikuti = gabungan.filter((g) => g.status === "diikuti");
  const berlangsung = gabungan.filter((g) => g.status === "berlangsung");
  const selesai = gabungan.filter((g) => g.status === "selesai");

  if (checking || !akun) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-canvas">
        <p className="text-[13.5px] text-ink/50">Memuat...</p>
      </main>
    );
  }

  function Kartu({ item }: { item: Gabungan }) {
    return (
      <Link
        href={`/pelajar/kelas/${item.kelas.id}`}
        className="group rounded-[1.25rem] border border-ink/10 bg-white p-5 transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-[0_20px_40px_-22px_rgba(20,23,31,0.28)]"
      >
        <div className="flex items-start justify-between gap-2">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl text-[22px] ${classTileBidang(
              item.kelas.bidang
            )}`}
          >
            {item.kelas.icon}
          </div>
          <div className="flex flex-wrap justify-end gap-1.5">
            <span
              className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${classKategori(
                item.kelas.kategori
              )}`}
            >
              {item.kelas.kategori}
            </span>
            {item.status === "selesai" && !item.ulasan && (
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10.5px] font-semibold text-amber-700">
                Beri ulasan
              </span>
            )}
            {item.status === "selesai" && item.ulasan && (
              <span className="rounded-full bg-sand px-2.5 py-1 text-[10.5px] font-medium text-ink/50">
                Sudah diulas
              </span>
            )}
            {item.status === "berlangsung" && (
              <span className="rounded-full bg-teal-tint px-2.5 py-1 text-[10.5px] font-semibold text-teal-deep">
                Berlangsung
              </span>
            )}
          </div>
        </div>

        <h3 className="mt-4 text-[14.5px] font-semibold leading-snug text-ink">
          {item.kelas.judul}
        </h3>
        <p className="mt-1 text-[12px] text-ink/50">{item.kelas.pengajarNama}</p>

        <div className="mt-3 text-[12px] text-ink/55">
          {formatTanggal(item.kelas.jadwalMulai)} &middot; {formatJam(item.kelas.jadwalMulai)}
        </div>

        <div className="mt-3 font-display text-[14px] font-bold text-teal-deep">
          {formatRupiah(item.kelas.harga)}
        </div>
      </Link>
    );
  }

  function Seksi({ judul, items }: { judul: string; items: Gabungan[] }) {
    if (items.length === 0) return null;
    return (
      <div className="mb-10">
        <h2 className="mb-4 text-[14.5px] font-semibold text-ink">
          {judul} <span className="text-ink/40">({items.length})</span>
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Kartu key={item.kelasId} item={item} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-canvas">
      <AppNav active="aktivitas" />

      <div className="mx-auto max-w-[1180px] px-6 py-10">
        <h1 className="font-display text-[24px] font-bold text-ink">
          Aktivitas kamu
        </h1>
        <p className="mt-1.5 text-[13.5px] text-ink/55">
          Semua kelas yang pernah kamu daftar, dari yang akan datang sampai
          yang sudah selesai.
        </p>

        <div className="mt-8">
          {gabungan.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink/15 bg-white/60 p-10 text-center">
              <p className="text-[13.5px] text-ink/55">
                Kamu belum mengikuti kelas apa pun.
              </p>
              <Link
                href="/pelajar/dashboard"
                className="mt-3 inline-block text-[13.5px] font-semibold text-cobalt-deep hover:underline"
              >
                Cari kelas sekarang
              </Link>
            </div>
          ) : (
            <>
              <Seksi judul="Sedang berlangsung" items={berlangsung} />
              <Seksi judul="Akan diikuti" items={diikuti} />
              <Seksi judul="Selesai" items={selesai} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
