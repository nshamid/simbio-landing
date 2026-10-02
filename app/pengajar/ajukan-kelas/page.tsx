"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppNav from "@/components/AppNav";
import {
  getAkun,
  getKelasPengajar,
  simpanKelasPengajar,
  formatRupiah,
  KEY_TOS,
  type Akun,
  type Kategori,
  type KelasPengajar,
} from "@/lib/simbio-data";

const BIDANG_OPTIONS = [
  "UI/UX Design",
  "Pemrograman Web",
  "Bahasa",
  "Public Speaking",
  "Fotografi",
];

const MEDIA_OPTIONS = ["Materi Presentasi", "Praktik", "Simulasi"];

// Harga mengikuti kategori (sesuai skema harga bertingkat Simbio).
const HARGA_KATEGORI: Record<Kategori, number> = {
  Dasar: 10000,
  Menengah: 15000,
  Mahir: 22000,
};

const KETERANGAN_KATEGORI: Record<Kategori, string> = {
  Dasar: "Untuk pemula",
  Menengah: "Butuh dasar",
  Mahir: "Tingkat lanjut",
};

const ICON_BIDANG: Record<string, string> = {
  "UI/UX Design": "🎨",
  "Pemrograman Web": "💻",
  Bahasa: "🗣️",
  "Public Speaking": "🎤",
  Fotografi: "📷",
};

export default function AjukanKelasPage() {
  const router = useRouter();
  const [akun, setAkun] = useState<Akun | null>(null);
  const [checking, setChecking] = useState(true);

  const [judul, setJudul] = useState("");
  const [bidang, setBidang] = useState("");
  const [kategori, setKategori] = useState<Kategori | "">("");
  const [output, setOutput] = useState("");
  const [media, setMedia] = useState<string[]>([]);
  const [durasi, setDurasi] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [jam, setJam] = useState("");
  const [error, setError] = useState("");

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
    // Popup S&K di dashboard tidak boleh dilewati.
    if (!localStorage.getItem(KEY_TOS)) {
      router.replace("/pengajar/dashboard");
      return;
    }
    setAkun(data);
    setChecking(false);
  }, [router]);

  function toggleMedia(m: string) {
    setMedia((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!akun) return;

    if (!judul.trim() || !bidang || !kategori || !output.trim()) {
      setError("Judul, bidang, kategori, dan output pembelajaran wajib diisi.");
      return;
    }
    if (media.length === 0) {
      setError("Pilih minimal satu media pembelajaran.");
      return;
    }
    const durasiMenit = parseInt(durasi, 10);
    if (!durasiMenit || durasiMenit < 1) {
      setError("Durasi kelas harus berupa angka (dalam menit).");
      return;
    }
    if (!tanggal || !jam) {
      setError("Tanggal dan jam kelas wajib diisi.");
      return;
    }
    const jadwal = new Date(`${tanggal}T${jam}`);
    if (isNaN(jadwal.getTime()) || jadwal.getTime() <= Date.now()) {
      setError("Jadwal kelas harus di waktu yang akan datang.");
      return;
    }

    setError("");
    const existing = getKelasPengajar();
    const baru: KelasPengajar = {
      id: "kp-" + Date.now(),
      judul: judul.trim(),
      bidang,
      kategori,
      harga: HARGA_KATEGORI[kategori],
      durasiMenit,
      output: output.trim(),
      media,
      icon: ICON_BIDANG[bidang] || "📚",
      pengajarNama: akun.nama,
      pengajarFoto: akun.foto,
      pengajarRating: 0,
      pengajarJumlahKelas: existing.length,
      jadwalMulai: jadwal.toISOString(),
      statusPengajuan: "menunggu",
      jumlahPendaftar: 0,
      reviewBintang5: 0,
    };
    simpanKelasPengajar([...existing, baru]);
    router.push("/pengajar/dashboard");
  }

  if (checking || !akun) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-canvas">
        <p className="text-[13.5px] text-ink/50">Memuat...</p>
      </main>
    );
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-ink/15 px-4 py-2.5 text-[13.5px] outline-none focus:border-cobalt";

  return (
    <main className="min-h-screen bg-canvas">
      <AppNav active="dashboard" />

      <div className="mx-auto max-w-[680px] px-6 py-10">
        <Link href="/pengajar/dashboard" className="text-[13px] font-medium text-ink/50 hover:text-ink">
          ← Kembali ke dashboard
        </Link>

        <h1 className="mt-4 font-display text-[24px] font-bold text-ink">Ajukan kelas baru</h1>
        <p className="mt-1.5 text-[13.5px] text-ink/55">
          Isi detail kelas selengkap mungkin agar cepat dikurasi tim Simbio.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 rounded-[1.75rem] border border-ink/10 bg-white p-8">
          <label className="block text-[12.5px] font-semibold text-ink">Judul kelas</label>
          <input
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            placeholder="Contoh: Dasar-Dasar UI/UX untuk Pemula"
            className={inputClass}
          />

          <label className="mt-5 block text-[12.5px] font-semibold text-ink">Bidang</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {BIDANG_OPTIONS.map((b) => (
              <button
                type="button"
                key={b}
                onClick={() => setBidang(b)}
                className={`rounded-full border px-3.5 py-1.5 text-[12.5px] transition-colors ${
                  bidang === b
                    ? "border-cobalt bg-cobalt text-white"
                    : "border-ink/15 text-ink/60 hover:border-ink/30"
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          <label className="mt-5 block text-[12.5px] font-semibold text-ink">Kategori kelas</label>
          <div className="mt-2 grid gap-2.5 sm:grid-cols-3">
            {(Object.keys(HARGA_KATEGORI) as Kategori[]).map((k) => (
              <button
                type="button"
                key={k}
                onClick={() => setKategori(k)}
                className={`rounded-2xl border p-3.5 text-left transition-colors ${
                  kategori === k
                    ? "border-cobalt bg-cobalt-tint"
                    : "border-ink/15 hover:border-ink/30"
                }`}
              >
                <div className="text-[13.5px] font-semibold text-ink">{k}</div>
                <div className="text-[11.5px] text-ink/50">{KETERANGAN_KATEGORI[k]}</div>
                <div className="mt-1.5 font-display text-[14px] font-bold text-teal-deep">
                  {formatRupiah(HARGA_KATEGORI[k])}
                </div>
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11.5px] text-ink/40">
            Harga per pendaftar mengikuti kategori. Tim Simbio dapat menyesuaikan
            kategori saat proses kurasi.
          </p>

          <label className="mt-5 block text-[12.5px] font-semibold text-ink">Output pembelajaran</label>
          <textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            placeholder="Apa yang akan bisa dilakukan peserta setelah kelas ini?"
            rows={3}
            className={`${inputClass} resize-none leading-[1.5]`}
          />

          <label className="mt-5 block text-[12.5px] font-semibold text-ink">Media pembelajaran</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {MEDIA_OPTIONS.map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => toggleMedia(m)}
                className={`rounded-full border px-3.5 py-1.5 text-[12.5px] transition-colors ${
                  media.includes(m)
                    ? "border-cobalt bg-cobalt text-white"
                    : "border-ink/15 text-ink/60 hover:border-ink/30"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-[12.5px] font-semibold text-ink">Durasi (menit)</label>
              <input
                type="number"
                min={1}
                value={durasi}
                onChange={(e) => setDurasi(e.target.value)}
                placeholder="60"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-ink">Tanggal</label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-ink">Jam mulai</label>
              <input
                type="time"
                value={jam}
                onChange={(e) => setJam(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-[12.5px] leading-[1.55] text-amber-800">
            Pengajuan akan ditinjau tim Simbio maksimal 2×24 jam untuk
            menentukan kategori dan tarif kelas.
          </div>

          {error && <p className="mt-4 text-[12.5px] font-medium text-red-500">{error}</p>}

          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-gradient-to-r from-teal to-cobalt py-3 text-[14px] font-semibold text-white transition-transform duration-300 ease-smooth hover:scale-[1.02]"
          >
            Kirim untuk ditinjau
          </button>
        </form>
      </div>
    </main>
  );
}
