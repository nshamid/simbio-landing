"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";

type Pendaftaran = {
  peran: "pengajar" | "pelajar";
  nama: string;
  email: string;
  password: string;
  pilihan: string[];
};

const STORAGE_KEY = "simbio_pendaftaran";

export default function MasukPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [googleInfo, setGoogleInfo] = useState(false);
  const [akun, setAkun] = useState<Pendaftaran | null>(null);
  const [belumAdaAkun, setBelumAdaAkun] = useState(false);
  const [salahPassword, setSalahPassword] = useState(false);

  // Kalau sebelumnya udah pernah "masuk" (mockup), langsung tampilkan
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setAkun(JSON.parse(saved));
      } catch {
        // data korup, abaikan
      }
    }
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBelumAdaAkun(false);
    setSalahPassword(false);

    if (!email.trim() || !password.trim()) {
      setError("Email dan password wajib diisi.");
      return;
    }

    // Mockup: belum ada backend, jadi cek dicocokkan ke data
    // pendaftaran yang tersimpan di browser ini saja.
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setBelumAdaAkun(true);
      return;
    }

    try {
      const parsed: Pendaftaran = JSON.parse(saved);
      if (parsed.email.trim().toLowerCase() !== email.trim().toLowerCase()) {
        setBelumAdaAkun(true);
        return;
      }
      if (parsed.password !== password) {
        setSalahPassword(true);
        return;
      }
      setAkun(parsed);
    } catch {
      setBelumAdaAkun(true);
    }
  }

  function handleKeluar() {
    setAkun(null);
    setEmail("");
    setPassword("");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-6 py-16">
      <div className="w-full max-w-[420px]">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <Image src="/logo-icon.png" alt="Simbio" width={28} height={26} />
          <span className="font-display text-[18px] font-bold text-ink">
            Simbio
          </span>
        </Link>

        <div className="rounded-[1.75rem] border border-ink/10 bg-white p-8 sm:p-10">
          {akun ? (
            <div>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-tint text-[26px]">
                👋
              </div>
              <h1 className="mt-5 text-center font-display text-[22px] font-bold text-ink">
                Selamat datang kembali, {akun.nama}!
              </h1>
              <p className="mt-2 text-center text-[13.5px] text-ink/60">
                Kamu masuk sebagai{" "}
                <span className="font-semibold text-ink">
                  {akun.peran === "pengajar" ? "Pengajar" : "Pelajar"}
                </span>
                .
              </p>

              {/*
                Kalau nanti Profil Saya / Cari Kelas / Ajukan Kelas
                sudah jadi halaman tersendiri, tombol ini masih tetap
                aman ke /beranda karena dari sana ada link-link lain.
              */}
              <Link
                href={akun.peran === "pengajar" ? "/pengajar/dashboard" : "/pelajar/dashboard"}
                className="mt-7 block w-full rounded-full bg-gradient-to-r from-teal to-cobalt py-3 text-center text-[14px] font-semibold text-white transition-transform duration-300 ease-smooth hover:scale-[1.02]"
              >
                Lanjut ke Dashboard
              </Link>

              <button
                onClick={handleKeluar}
                className="mt-3 w-full rounded-full border border-ink/15 py-3 text-[14px] font-semibold text-ink/70 transition-colors hover:border-ink/30 hover:text-ink"
              >
                Keluar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h1 className="text-center font-display text-[22px] font-bold text-ink">
                Masuk ke Simbio
              </h1>
              <p className="mt-2 text-center text-[13.5px] text-ink/55">
                Lanjutkan belajar atau mengajar di tempat kamu tinggalkan.
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
                  Masuk dengan Google belum tersedia di demo ini.
                </p>
              )}

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-ink/10" />
                <span className="text-[12px] text-ink/40">atau</span>
                <div className="h-px flex-1 bg-ink/10" />
              </div>

              <label className="block text-[12.5px] font-semibold text-ink">
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
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-xl border border-ink/15 px-4 py-2.5 text-[13.5px] outline-none focus:border-cobalt"
              />

              {error && (
                <p className="mt-4 text-[12.5px] font-medium text-red-500">
                  {error}
                </p>
              )}

              {belumAdaAkun && (
                <p className="mt-4 text-[12.5px] leading-[1.6] text-ink/60">
                  Akun belum ditemukan di perangkat ini. Silakan{" "}
                  <Link href="/daftar" className="font-semibold text-cobalt-deep">
                    daftar dulu
                  </Link>
                  .
                </p>
              )}

              {salahPassword && (
                <p className="mt-4 text-[12.5px] font-medium text-red-500">
                  Password salah, coba lagi.
                </p>
              )}

              <button
                type="submit"
                className="mt-7 w-full rounded-full bg-gradient-to-r from-teal to-cobalt py-3 text-[14px] font-semibold text-white transition-transform duration-300 ease-smooth hover:scale-[1.02]"
              >
                Masuk
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-[12.5px] text-ink/45">
          Halaman ini demo lokal — mengecek data pendaftaran yang tersimpan
          di browser kamu sendiri, belum ke server.
        </p>
      </div>
    </main>
  );
}
