"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppNav from "@/components/AppNav";
import { getAkun, type Akun } from "@/lib/simbio-data";

export default function AcaraPage() {
  const router = useRouter();
  const [akun, setAkun] = useState<Akun | null>(null);
  const [checking, setChecking] = useState(true);

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
    setAkun(data);
    setChecking(false);
  }, [router]);

  if (checking || !akun) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-canvas">
        <p className="text-[13.5px] text-ink/50">Memuat...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-canvas">
      <AppNav active="acara" />

      <div className="mx-auto max-w-[680px] px-6 py-10">
        <h1 className="font-display text-[24px] font-bold text-ink">Acara</h1>
        <p className="mt-1.5 text-[13.5px] text-ink/55">
          Webinar, workshop, dan kegiatan lain dari Simbio dan mitra kami.
        </p>

        <div className="mt-8 flex flex-col items-center rounded-[1.75rem] border border-dashed border-ink/15 bg-white/60 px-6 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-teal to-cobalt text-[28px]">
            🎉
          </div>
          <h2 className="mt-5 font-display text-[20px] font-bold text-ink">
            Segera hadir
          </h2>
          <p className="mt-2 max-w-[380px] text-[13.5px] leading-[1.6] text-ink/55">
            Ke depannya, halaman ini akan menampilkan acara dari Simbio
            maupun kolaborasi bersama mitra dan sponsor untuk pengajar dan
            pelajar. Nantikan kabarnya di sini.
          </p>
        </div>
      </div>
    </main>
  );
}
