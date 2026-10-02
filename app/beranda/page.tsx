"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type Pendaftaran = {
  peran: "pengajar" | "pelajar";
  nama: string;
  email: string;
  pilihan: string[];
  pengalaman?: string;
  portofolio?: string;
  asalInstansi?: string;
  jenjang?: string;
  foto?: string;
  profilLengkap?: boolean;
};

const STORAGE_KEY = "simbio_pendaftaran";

export default function BerandaPage() {
  const router = useRouter();
  const [data, setData] = useState<Pendaftaran | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      router.replace("/daftar");
      return;
    }
    try {
      const parsed: Pendaftaran = JSON.parse(saved);
      if (!parsed.profilLengkap) {
        router.replace("/lengkapi-profil");
        return;
      }
      setData(parsed);
    } catch {
      router.replace("/daftar");
      return;
    }
    setChecking(false);
  }, [router]);

  function handleKeluar() {
    localStorage.removeItem(STORAGE_KEY);
    router.push("/");
  }

  if (checking || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-canvas">
        <p className="text-[13.5px] text-ink/50">Memuat...</p>
      </main>
    );
  }

  const isPengajar = data.peran === "pengajar";

  return (
    <main className="min-h-screen bg-canvas">
      {/* Nav khusus area yang sudah login — beda dari navbar landing page */}
      <header className="border-b border-ink/[0.06] bg-white">
        <div className="mx-auto flex h-[68px] max-w-[1040px] items-center justify-between px-6">
          <Link href="/beranda" className="flex items-center gap-2.5">
            <Image src="/logo-icon.png" alt="Simbio" width={26} height={24} />
            <span className="font-display text-[16.5px] font-bold text-ink">
              Simbio
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-[13.5px] sm:flex">
            <span className="font-semibold text-ink">Beranda</span>
            <span className="flex items-center gap-1.5 text-ink/35">
              Profil Saya
              <span className="rounded-full bg-sand px-2 py-0.5 text-[10.5px] font-medium text-ink/50">
                Segera
              </span>
            </span>
            <span className="flex items-center gap-1.5 text-ink/35">
              {isPengajar ? "Ajukan Kelas" : "Cari Kelas"}
              <span className="rounded-full bg-sand px-2 py-0.5 text-[10.5px] font-medium text-ink/50">
                Segera
              </span>
            </span>
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-sand">
              {data.foto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.foto}
                  alt={data.nama}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-[12px] font-semibold text-ink/50">
                  {data.nama.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <button
              onClick={handleKeluar}
              className="text-[13.5px] font-medium text-ink/60 hover:text-ink"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1040px] px-6 py-12">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-sand">
            {data.foto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.foto}
                alt={data.nama}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="font-display text-[19px] font-bold text-ink/40">
                {data.nama.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h1 className="font-display text-[26px] font-bold text-ink">
              Halo, {data.nama} 👋
            </h1>
            <span
              className={`mt-1 inline-block rounded-full px-3 py-1 text-[12px] font-semibold text-white ${
                isPengajar ? "bg-cobalt" : "bg-teal"
              }`}
            >
              {isPengajar ? "Pengajar" : "Pelajar"}
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          {/* Ringkasan profil */}
          <div className="rounded-[1.5rem] border border-ink/10 bg-white p-7">
            <h2 className="text-[15px] font-semibold text-ink">
              Profil kamu
            </h2>

            <div className="mt-5 space-y-4 text-[13.5px]">
              <div className="flex justify-between gap-4 border-b border-ink/8 pb-4">
                <span className="text-ink/50">Email</span>
                <span className="text-right font-medium text-ink">
                  {data.email}
                </span>
              </div>
              <div className="flex justify-between gap-4 border-b border-ink/8 pb-4">
                <span className="shrink-0 text-ink/50">
                  {isPengajar ? "Bidang keahlian" : "Minat belajar"}
                </span>
                <span className="text-right font-medium text-ink">
                  {data.pilihan.join(", ")}
                </span>
              </div>

              {isPengajar ? (
                <>
                  <div className="pb-1">
                    <span className="text-ink/50">Pengalaman</span>
                    <p className="mt-1.5 leading-[1.6] text-ink">
                      {data.pengalaman || "—"}
                    </p>
                  </div>
                  {data.portofolio && (
                    <div>
                      <span className="text-ink/50">Portofolio</span>
                      <p className="mt-1.5 break-all text-cobalt-deep">
                        {data.portofolio}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex justify-between gap-4 border-b border-ink/8 pb-4">
                    <span className="text-ink/50">Asal instansi</span>
                    <span className="text-right font-medium text-ink">
                      {data.asalInstansi || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-ink/50">Jenjang</span>
                    <span className="text-right font-medium text-ink">
                      {data.jenjang || "—"}
                    </span>
                  </div>
                </>
              )}
            </div>

            <Link
              href="/lengkapi-profil"
              className="mt-6 inline-block text-[13px] font-semibold text-cobalt-deep hover:underline"
            >
              Edit profil
            </Link>
          </div>

          {/* Next step placeholder */}
          <div className="rounded-[1.5rem] border border-dashed border-ink/15 bg-white/60 p-7">
            <h2 className="text-[15px] font-semibold text-ink">
              Langkah berikutnya
            </h2>
            <p className="mt-2 text-[13px] leading-[1.6] text-ink/55">
              {isPengajar
                ? "Halaman untuk mengajukan kelas pertamamu masih dalam pengembangan."
                : "Halaman untuk mencari kelas pertamamu masih dalam pengembangan."}
            </p>
            <span className="mt-4 inline-block rounded-full bg-sand px-3 py-1 text-[11.5px] font-medium text-ink/50">
              Segera hadir
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
