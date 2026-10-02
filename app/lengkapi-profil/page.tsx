"use client";

import { useEffect, useState, type FormEvent } from "react";
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
const JENJANG_OPTIONS = ["SMA/SMK", "Mahasiswa Aktif", "Umum"];

// Mengecilkan gambar ke maksimal 300px sebelum disimpan ke localStorage,
// supaya ukurannya tidak terlalu besar.
function resizeImage(file: File, maxSize = 300): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = document.createElement("img");
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        } else if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas tidak didukung"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = () => reject(new Error("Gagal memuat gambar"));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Gagal membaca file"));
    reader.readAsDataURL(file);
  });
}

export default function LengkapiProfilPage() {
  const router = useRouter();
  const [data, setData] = useState<Pendaftaran | null>(null);
  const [checking, setChecking] = useState(true);

  const [pengalaman, setPengalaman] = useState("");
  const [portofolio, setPortofolio] = useState("");
  const [asalInstansi, setAsalInstansi] = useState("");
  const [jenjang, setJenjang] = useState("");
  const [foto, setFoto] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Kalau belum ada data pendaftaran sama sekali, lempar balik ke /daftar
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      router.replace("/daftar");
      return;
    }
    try {
      const parsed = JSON.parse(saved);
      setData(parsed);
      if (parsed.foto) setFoto(parsed.foto);
    } catch {
      router.replace("/daftar");
      return;
    }
    setChecking(false);
  }, [router]);

  async function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      return;
    }
    try {
      const resized = await resizeImage(file);
      setFoto(resized);
      setError("");
    } catch {
      setError("Gagal memuat gambar, coba file lain.");
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!data) return;

    if (data.peran === "pengajar" && !pengalaman.trim()) {
      setError("Ceritakan sedikit pengalamanmu dulu, ya.");
      return;
    }
    if (data.peran === "pelajar" && (!asalInstansi.trim() || !jenjang)) {
      setError("Asal instansi dan jenjang wajib diisi.");
      return;
    }

    setError("");
    const updated: Pendaftaran = {
      ...data,
      ...(foto ? { foto } : {}),
      ...(data.peran === "pengajar"
        ? { pengalaman: pengalaman.trim(), portofolio: portofolio.trim() }
        : { asalInstansi: asalInstansi.trim(), jenjang }),
      profilLengkap: true,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    router.push(
      updated.peran === "pengajar" ? "/pengajar/dashboard" : "/pelajar/dashboard"
    );
  }

  if (checking || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-canvas">
        <p className="text-[13.5px] text-ink/50">Memuat...</p>
      </main>
    );
  }

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
          <form onSubmit={handleSubmit}>
            <h1 className="text-center font-display text-[22px] font-bold text-ink">
              Lengkapi profil kamu
            </h1>
            <p className="mt-2 text-center text-[13.5px] text-ink/55">
              Halo {data.nama}, satu langkah lagi sebelum masuk ke Simbio.
            </p>

            <div className="mt-6 flex flex-col items-center">
              <label className="group relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-ink/20 bg-canvas transition-colors hover:border-cobalt">
                {foto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={foto}
                    alt="Foto profil"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-ink/35">
                    <path d="M4 8a2 2 0 0 1 2-2h1.5l1-1.5h7l1 1.5H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                    <circle cx="12" cy="12.5" r="3.3" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFotoChange}
                  className="hidden"
                />
              </label>
              <span className="mt-2 text-[12px] font-medium text-cobalt-deep">
                {foto ? "Ganti foto" : "Unggah foto profil"}
              </span>
            </div>

            {data.peran === "pengajar" ? (
              <>
                <label className="mt-6 block text-[12.5px] font-semibold text-ink">
                  Pengalaman singkat
                </label>
                <textarea
                  value={pengalaman}
                  onChange={(e) => setPengalaman(e.target.value)}
                  placeholder="Ceritakan latar belakang atau pengalamanmu di bidang yang kamu pilih..."
                  rows={4}
                  className="mt-1.5 w-full resize-none rounded-xl border border-ink/15 px-4 py-2.5 text-[13.5px] leading-[1.5] outline-none focus:border-cobalt"
                />

                <label className="mt-4 block text-[12.5px] font-semibold text-ink">
                  Link portofolio <span className="text-ink/40">(opsional)</span>
                </label>
                <input
                  value={portofolio}
                  onChange={(e) => setPortofolio(e.target.value)}
                  placeholder="https://..."
                  className="mt-1.5 w-full rounded-xl border border-ink/15 px-4 py-2.5 text-[13.5px] outline-none focus:border-cobalt"
                />
              </>
            ) : (
              <>
                <label className="mt-6 block text-[12.5px] font-semibold text-ink">
                  Asal sekolah / kampus
                </label>
                <input
                  value={asalInstansi}
                  onChange={(e) => setAsalInstansi(e.target.value)}
                  placeholder="Nama sekolah atau kampusmu"
                  className="mt-1.5 w-full rounded-xl border border-ink/15 px-4 py-2.5 text-[13.5px] outline-none focus:border-cobalt"
                />

                <label className="mt-4 block text-[12.5px] font-semibold text-ink">
                  Jenjang
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {JENJANG_OPTIONS.map((opsi) => (
                    <button
                      type="button"
                      key={opsi}
                      onClick={() => setJenjang(opsi)}
                      className={`rounded-full border px-3.5 py-1.5 text-[12.5px] transition-colors ${
                        jenjang === opsi
                          ? "border-teal bg-teal text-white"
                          : "border-ink/15 text-ink/60 hover:border-ink/30"
                      }`}
                    >
                      {opsi}
                    </button>
                  ))}
                </div>
              </>
            )}

            {error && (
              <p className="mt-4 text-[12.5px] font-medium text-red-500">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="mt-7 w-full rounded-full bg-gradient-to-r from-teal to-cobalt py-3 text-[14px] font-semibold text-white transition-transform duration-300 ease-smooth hover:scale-[1.02]"
            >
              Simpan & lanjutkan
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[12.5px] text-ink/45">
          Data ini masih tersimpan di browser kamu sendiri (localStorage),
          belum ke server.
        </p>
      </div>
    </main>
  );
}
