"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";

type Peran = "pengajar" | "pelajar";

type Pendaftaran = {
  peran: Peran;
  nama: string;
  email: string;
  password: string;
  pilihan: string[];
};

const BIDANG_OPTIONS = [
  "UI/UX Design",
  "Pemrograman Web",
  "Bahasa",
  "Public Speaking",
  "Fotografi",
  "Lainnya",
];

const MINAT_OPTIONS = [
  "Desain",
  "Pemrograman",
  "Bahasa",
  "Public Speaking",
  "Fotografi",
  "Lainnya",
];

const STORAGE_KEY = "simbio_pendaftaran";

export default function DaftarPage() {
  const [peran, setPeran] = useState<Peran>("pengajar");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pilihan, setPilihan] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [googleInfo, setGoogleInfo] = useState(false);
  const [sukses, setSukses] = useState<Pendaftaran | null>(null);

  // Kalau sebelumnya pernah daftar (localStorage), langsung tampilkan state sukses
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSukses(JSON.parse(saved));
      } catch {
        // data korup, abaikan
      }
    }
  }, []);

  function toggleOpsi(opsi: string) {
    setPilihan((prev) =>
      prev.includes(opsi) ? prev.filter((o) => o !== opsi) : [...prev, opsi]
    );
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!nama.trim() || !email.trim() || !password.trim()) {
      setError("Nama, email, dan password wajib diisi.");
      return;
    }
    if (password.trim().length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }
    if (pilihan.length === 0) {
      setError(
        peran === "pengajar"
          ? "Pilih minimal satu bidang keahlian."
          : "Pilih minimal satu minat belajar."
      );
      return;
    }

    setError("");
    const data: Pendaftaran = {
      peran,
      nama: nama.trim(),
      email: email.trim(),
      password: password.trim(),
      pilihan,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSukses(data);
  }

  function handleReset() {
    localStorage.removeItem(STORAGE_KEY);
    setSukses(null);
    setNama("");
    setEmail("");
    setPassword("");
    setPilihan([]);
    setPeran("pengajar");
    setError("");
  }

  const opsiList = peran === "pengajar" ? BIDANG_OPTIONS : MINAT_OPTIONS;

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-6 py-16">
      <div className="w-full max-w-[460px]">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <Image src="/logo-icon.png" alt="Simbio" width={28} height={26} />
          <span className="font-display text-[18px] font-bold text-ink">
            Simbio
          </span>
        </Link>

        <div className="rounded-[1.75rem] border border-ink/10 bg-white p-8 sm:p-10">
          {sukses ? (
            <div>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-tint text-[26px]">
                🎉
              </div>
              <h1 className="mt-5 text-center font-display text-[22px] font-bold text-ink">
                Pendaftaran berhasil, {sukses.nama}!
              </h1>
              <p className="mt-2 text-center text-[13.5px] text-ink/60">
                Kamu terdaftar sebagai{" "}
                <span className="font-semibold text-ink">
                  {sukses.peran === "pengajar" ? "Pengajar" : "Pelajar"}
                </span>
                .
              </p>

              <div className="mt-6 space-y-3 rounded-2xl bg-canvas p-5 text-[13.5px]">
                <div className="flex justify-between gap-4">
                  <span className="shrink-0 text-ink/55">Email</span>
                  <span className="text-right font-medium text-ink">
                    {sukses.email}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="shrink-0 text-ink/55">
                    {sukses.peran === "pengajar" ? "Bidang" : "Minat"}
                  </span>
                  <span className="text-right font-medium text-ink">
                    {sukses.pilihan.join(", ")}
                  </span>
                </div>
              </div>

              {/*
                Nanti kalau halaman dashboard pengajar/pelajar udah jadi,
                arahkan tombol di bawah ini ke sana, misalnya:
                sukses.peran === "pengajar" ? "/pengajar/dashboard" : "/pelajar/cari-kelas"
                Untuk sekarang, arahkan dulu ke beranda.
              */}
              <Link
                href="/beranda"
                className="mt-7 block w-full rounded-full bg-gradient-to-r from-teal to-cobalt py-3 text-center text-[14px] font-semibold text-white transition-transform duration-300 ease-smooth hover:scale-[1.02]"
              >
                Selesai
              </Link>

              <button
                onClick={handleReset}
                className="mt-3 w-full rounded-full border border-ink/15 py-3 text-[14px] font-semibold text-ink/70 transition-colors hover:border-ink/30 hover:text-ink"
              >
                Coba isi ulang
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h1 className="text-center font-display text-[22px] font-bold text-ink">
                Daftar ke Simbio
              </h1>
              <p className="mt-2 text-center text-[13.5px] text-ink/55">
                Mulai berbagi ilmu atau belajar sesuatu yang baru.
              </p>

              <button
                type="button"
                onClick={() => setGoogleInfo(true)}
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-ink/15 py-3 text-[13.5px] font-semibold text-ink transition-colors hover:border-ink/30"
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z" />
                  <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z" />
                  <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33z" />
                  <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
                </svg>
                Lanjutkan dengan Google
              </button>
              {googleInfo && (
                <p className="mt-2.5 text-center text-[12px] text-ink/45">
                  Daftar dengan Google belum tersedia di demo ini.
                </p>
              )}

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-ink/10" />
                <span className="text-[12px] text-ink/40">atau</span>
                <div className="h-px flex-1 bg-ink/10" />
              </div>

              <div className="grid grid-cols-2 gap-2 rounded-full bg-canvas p-1">
                <button
                  type="button"
                  onClick={() => {
                    setPeran("pengajar");
                    setPilihan([]);
                  }}
                  className={`rounded-full py-2.5 text-[13.5px] font-semibold transition-colors ${
                    peran === "pengajar"
                      ? "bg-cobalt text-white"
                      : "text-ink/55 hover:text-ink"
                  }`}
                >
                  Pengajar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPeran("pelajar");
                    setPilihan([]);
                  }}
                  className={`rounded-full py-2.5 text-[13.5px] font-semibold transition-colors ${
                    peran === "pelajar"
                      ? "bg-teal text-white"
                      : "text-ink/55 hover:text-ink"
                  }`}
                >
                  Pelajar
                </button>
              </div>

              <label className="mt-6 block text-[12.5px] font-semibold text-ink">
                Nama lengkap
              </label>
              <input
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama kamu"
                className="mt-1.5 w-full rounded-xl border border-ink/15 px-4 py-2.5 text-[13.5px] outline-none focus:border-cobalt"
              />

              <label className="mt-4 block text-[12.5px] font-semibold text-ink">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="mt-1.5 w-full rounded-xl border border-ink/15 px-4 py-2.5 text-[13.5px] outline-none focus:border-cobalt"
              />

              <label className="mt-4 block text-[12.5px] font-semibold text-ink">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="mt-1.5 w-full rounded-xl border border-ink/15 px-4 py-2.5 text-[13.5px] outline-none focus:border-cobalt"
              />

              <label className="mt-4 block text-[12.5px] font-semibold text-ink">
                {peran === "pengajar" ? "Bidang keahlian" : "Minat belajar"}
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {opsiList.map((opsi) => (
                  <button
                    type="button"
                    key={opsi}
                    onClick={() => toggleOpsi(opsi)}
                    className={`rounded-full border px-3.5 py-1.5 text-[12.5px] transition-colors ${
                      pilihan.includes(opsi)
                        ? peran === "pengajar"
                          ? "border-cobalt bg-cobalt text-white"
                          : "border-teal bg-teal text-white"
                        : "border-ink/15 text-ink/60 hover:border-ink/30"
                    }`}
                  >
                    {opsi}
                  </button>
                ))}
              </div>

              {error && (
                <p className="mt-4 text-[12.5px] font-medium text-red-500">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="mt-7 w-full rounded-full bg-gradient-to-r from-teal to-cobalt py-3 text-[14px] font-semibold text-white transition-transform duration-300 ease-smooth hover:scale-[1.02]"
              >
                Daftar sekarang
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-[12.5px] text-ink/45">
          Halaman ini demo lokal — data tersimpan di browser kamu sendiri
          (localStorage), belum ke server.
        </p>
      </div>
    </main>
  );
}
