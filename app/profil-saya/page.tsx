"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppNav from "@/components/AppNav";
import {
  getAkun,
  simpanAkun,
  resizeImage,
  sinkronAktivitas,
  sinkronKelasPengajar,
  getSeedBadges,
  getAktifSejak,
  type Akun,
  type Badge,
} from "@/lib/simbio-data";

const KEY_SERTIFIKAT = "simbio_sertifikat_diklaim";

export default function ProfilSayaPage() {
  const router = useRouter();
  const [akun, setAkun] = useState<Akun | null>(null);
  const [checking, setChecking] = useState(true);

  const [foto, setFoto] = useState<string | undefined>(undefined);
  const [bio, setBio] = useState("");
  const [linkSosial, setLinkSosial] = useState("");
  const [tersimpan, setTersimpan] = useState(false);
  const [badgeDipilih, setBadgeDipilih] = useState<Badge | null>(null);
  const [errorFoto, setErrorFoto] = useState("");

  const [jumlahSelesaiPelajar, setJumlahSelesaiPelajar] = useState(0);
  const [jumlahDisetujuiPengajar, setJumlahDisetujuiPengajar] = useState(0);
  const [jumlahSelesaiPengajar, setJumlahSelesaiPengajar] = useState(0);
  const [jumlahReviewLima, setJumlahReviewLima] = useState(0);
  const [bulanAktif, setBulanAktif] = useState(0);
  const [diklaim, setDiklaim] = useState<Record<string, boolean>>({});

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
    setFoto(data.foto);
    setBio(data.bio || "");
    setLinkSosial(data.linkSosial || "");

    if (data.peran === "pelajar") {
      const aktivitas = sinkronAktivitas();
      setJumlahSelesaiPelajar(aktivitas.filter((a) => a.status === "selesai").length);
    } else {
      const kelas = sinkronKelasPengajar();
      setJumlahDisetujuiPengajar(
        kelas.filter((k) =>
          ["disetujui_belum_mulai", "berlangsung", "selesai"].includes(k.statusPengajuan)
        ).length
      );
      setJumlahSelesaiPengajar(kelas.filter((k) => k.statusPengajuan === "selesai").length);
      setJumlahReviewLima(kelas.reduce((sum, k) => sum + k.reviewBintang5, 0));

      const sejak = getAktifSejak();
      if (sejak) {
        const hariBerlalu = (Date.now() - new Date(sejak).getTime()) / (1000 * 60 * 60 * 24);
        setBulanAktif(hariBerlalu / 30);
      }

      try {
        const savedKlaim = localStorage.getItem(KEY_SERTIFIKAT);
        if (savedKlaim) setDiklaim(JSON.parse(savedKlaim));
      } catch {
        // abaikan
      }
    }

    setChecking(false);
  }, [router]);

  const badges = useMemo(() => (akun ? getSeedBadges(akun.peran) : []), [akun]);

  function badgeDiperoleh(badgeId: string): boolean {
    if (!akun) return false;
    if (badgeId === "b-pelajar-baru" || badgeId === "b-pengajar-baru") return true;
    if (akun.peran === "pelajar") {
      if (badgeId === "b-kelas-pertama") return jumlahSelesaiPelajar >= 1;
      if (badgeId === "b-pelajar-aktif") return jumlahSelesaiPelajar >= 3;
    } else {
      if (badgeId === "b-kelas-pertama") return jumlahDisetujuiPengajar >= 1;
      if (badgeId === "b-berpengalaman") return jumlahSelesaiPengajar >= 5;
    }
    return false;
  }

  function handleKlaim(targetId: string) {
    const updated = { ...diklaim, [targetId]: true };
    setDiklaim(updated);
    localStorage.setItem(KEY_SERTIFIKAT, JSON.stringify(updated));
  }

  async function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrorFoto("File harus berupa gambar.");
      return;
    }
    try {
      const resized = await resizeImage(file);
      setFoto(resized);
      setErrorFoto("");
    } catch {
      setErrorFoto("Gagal memuat gambar, coba file lain.");
    }
  }

  function handleSimpan() {
    if (!akun) return;
    const updated: Akun = { ...akun, foto, bio: bio.trim(), linkSosial: linkSosial.trim() };
    simpanAkun(updated);
    setAkun(updated);
    setTersimpan(true);
    setTimeout(() => setTersimpan(false), 2500);
  }

  if (checking || !akun) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-canvas">
        <p className="text-[13.5px] text-ink/50">Memuat...</p>
      </main>
    );
  }

  const isPengajar = akun.peran === "pengajar";

  return (
    <main className="min-h-screen bg-canvas">
      <AppNav active="profil" />

      <div className="mx-auto max-w-[860px] px-6 py-10">
        <h1 className="font-display text-[24px] font-bold text-ink">
          Profil Saya
        </h1>
        <p className="mt-1.5 text-[13.5px] text-ink/55">
          Profil ini yang dilihat orang lain di Simbio.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* Kolom kiri: foto + info dasar (read-only) */}
          <div className="space-y-5">
            <div className="rounded-[1.5rem] border border-ink/10 bg-white p-7 text-center">
              <label className="group relative mx-auto flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-ink/20 bg-canvas transition-colors hover:border-cobalt">
                {foto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={foto} alt={akun.nama} className="h-full w-full object-cover" />
                ) : (
                  <span className="font-display text-[26px] font-bold text-ink/30">
                    {akun.nama.charAt(0).toUpperCase()}
                  </span>
                )}
                <input type="file" accept="image/*" onChange={handleFotoChange} className="hidden" />
              </label>
              {errorFoto && <p className="mt-2 text-[11.5px] text-red-500">{errorFoto}</p>}

              <h2 className="mt-4 text-[16px] font-semibold text-ink">{akun.nama}</h2>
              <span
                className={`mt-1.5 inline-block rounded-full px-3 py-1 text-[11.5px] font-semibold text-white ${
                  isPengajar ? "bg-cobalt" : "bg-teal"
                }`}
              >
                {isPengajar ? "Pengajar" : "Pelajar"}
              </span>
            </div>

            <div className="rounded-[1.5rem] border border-ink/10 bg-white p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[12.5px] font-semibold uppercase tracking-wide text-ink/45">
                  Info dasar
                </h3>
                <Link href="/lengkapi-profil" className="text-[12px] font-semibold text-cobalt-deep hover:underline">
                  Edit
                </Link>
              </div>

              <div className="mt-4 space-y-3 text-[13px]">
                <div className="flex justify-between gap-3 border-b border-ink/8 pb-3">
                  <span className="text-ink/50">Email</span>
                  <span className="text-right font-medium text-ink">{akun.email}</span>
                </div>
                <div className="flex justify-between gap-3 border-b border-ink/8 pb-3">
                  <span className="shrink-0 text-ink/50">
                    {isPengajar ? "Bidang" : "Minat"}
                  </span>
                  <span className="text-right font-medium text-ink">
                    {akun.pilihan.join(", ")}
                  </span>
                </div>
                {isPengajar ? (
                  <div>
                    <span className="text-ink/50">Pengalaman</span>
                    <p className="mt-1.5 leading-[1.6] text-ink">{akun.pengalaman || "—"}</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between gap-3 border-b border-ink/8 pb-3">
                      <span className="text-ink/50">Asal instansi</span>
                      <span className="text-right font-medium text-ink">{akun.asalInstansi || "—"}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-ink/50">Jenjang</span>
                      <span className="text-right font-medium text-ink">{akun.jenjang || "—"}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Kolom kanan: bio, link sosmed, badge */}
          <div className="space-y-5">
            <div className="rounded-[1.5rem] border border-ink/10 bg-white p-7">
              <label className="block text-[12.5px] font-semibold text-ink">Bio singkat</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Ceritakan sedikit tentang dirimu..."
                rows={3}
                className="mt-1.5 w-full resize-none rounded-xl border border-ink/15 px-4 py-2.5 text-[13.5px] leading-[1.5] outline-none focus:border-cobalt"
              />

              <label className="mt-4 block text-[12.5px] font-semibold text-ink">
                Link sosial media
              </label>
              <input
                value={linkSosial}
                onChange={(e) => setLinkSosial(e.target.value)}
                placeholder="https://instagram.com/username"
                className="mt-1.5 w-full rounded-xl border border-ink/15 px-4 py-2.5 text-[13.5px] outline-none focus:border-cobalt"
              />

              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={handleSimpan}
                  className="rounded-full bg-gradient-to-r from-teal to-cobalt px-6 py-2.5 text-[13.5px] font-semibold text-white transition-transform duration-300 ease-smooth hover:scale-[1.02]"
                >
                  Simpan Perubahan
                </button>
                {tersimpan && (
                  <span className="text-[12.5px] font-medium text-teal-deep">Tersimpan ✓</span>
                )}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-ink/10 bg-white p-7">
              <h3 className="text-[12.5px] font-semibold uppercase tracking-wide text-ink/45">
                Badge
              </h3>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {badges.map((b) => {
                  const earned = badgeDiperoleh(b.id);
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBadgeDipilih(b)}
                      className={`rounded-2xl border p-4 text-center transition-transform duration-200 ease-smooth hover:-translate-y-0.5 ${
                        earned ? "border-ink/10 bg-white" : "border-ink/8 bg-canvas opacity-45"
                      }`}
                    >
                      <div className="text-[22px]">{b.icon}</div>
                      <div className="mt-2 text-[11px] font-semibold leading-tight text-ink">
                        {b.nama}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {isPengajar && (
              <div className="rounded-[1.5rem] border border-ink/10 bg-white p-7">
                <h3 className="text-[12.5px] font-semibold uppercase tracking-wide text-ink/45">
                  Target &amp; Sertifikat
                </h3>
                <p className="mt-1.5 text-[12px] leading-[1.5] text-ink/45">
                  Capai target ini untuk klaim e-sertifikat resmi dari Simbio.
                </p>

                <div className="mt-5 space-y-6">
                  {[
                    {
                      id: "sertifikat-10-kelas",
                      label: "Selesaikan 10 Kelas Mengajar",
                      nilai: jumlahSelesaiPengajar,
                      target: 10,
                      tampil: `${jumlahSelesaiPengajar}/10 kelas`,
                    },
                    {
                      id: "sertifikat-3-bulan",
                      label: "Aktif Mengajar Selama 3 Bulan",
                      nilai: bulanAktif,
                      target: 3,
                      tampil: `${bulanAktif.toFixed(1)}/3 bulan`,
                    },
                    {
                      id: "sertifikat-10-review",
                      label: "Raih 10 Review Bintang 5",
                      nilai: jumlahReviewLima,
                      target: 10,
                      tampil: `${jumlahReviewLima}/10 review`,
                    },
                  ].map((t) => {
                    const persen = Math.min(100, Math.round((t.nilai / t.target) * 100));
                    const selesai = persen >= 100;
                    const sudahDiklaim = !!diklaim[t.id];
                    return (
                      <div key={t.id}>
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-semibold text-ink">{t.label}</span>
                          <span className="text-[11.5px] text-ink/45">{t.tampil}</span>
                        </div>
                        <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-canvas">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ease-smooth ${
                              selesai ? "bg-gradient-to-r from-teal to-cobalt" : "bg-cobalt/60"
                            }`}
                            style={{ width: `${persen}%` }}
                          />
                        </div>
                        {selesai && (
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[11.5px] font-semibold text-teal-deep">
                              Target tercapai 🎉
                            </span>
                            {sudahDiklaim ? (
                              <span className="text-[11.5px] font-medium text-ink/40">
                                Sertifikat diklaim ✓
                              </span>
                            ) : (
                              <button
                                onClick={() => handleKlaim(t.id)}
                                className="rounded-full bg-gradient-to-r from-teal to-cobalt px-4 py-1.5 text-[11.5px] font-semibold text-white transition-transform duration-300 ease-smooth hover:scale-105"
                              >
                                Klaim e-Sertifikat
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popup penjelasan badge */}
      {badgeDipilih && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-6"
          onClick={() => setBadgeDipilih(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[340px] rounded-[1.75rem] bg-white p-7 text-center"
          >
            <div
              className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-[30px] ${
                badgeDiperoleh(badgeDipilih.id) ? "bg-teal-tint" : "bg-canvas grayscale opacity-60"
              }`}
            >
              {badgeDipilih.icon}
            </div>
            <h3 className="mt-4 font-display text-[18px] font-bold text-ink">
              {badgeDipilih.nama}
            </h3>
            <p className="mt-2 text-[13px] leading-[1.55] text-ink/60">
              {badgeDipilih.deskripsi}
            </p>
            <span
              className={`mt-4 inline-block rounded-full px-3 py-1 text-[11.5px] font-semibold ${
                badgeDiperoleh(badgeDipilih.id)
                  ? "bg-teal-tint text-teal-deep"
                  : "bg-sand text-ink/50"
              }`}
            >
              {badgeDiperoleh(badgeDipilih.id) ? "Sudah diperoleh" : "Belum diperoleh"}
            </span>
            <button
              onClick={() => setBadgeDipilih(null)}
              className="mt-5 w-full rounded-full border border-ink/15 py-2.5 text-[13.5px] font-semibold text-ink/70 hover:border-ink/30 hover:text-ink"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
