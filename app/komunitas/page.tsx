"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppNav from "@/components/AppNav";
import {
  getAkun,
  getPosts,
  simpanPosts,
  formatWaktuRelatif,
  type Akun,
  type PostKomunitas,
  type Komentar,
} from "@/lib/simbio-data";

export default function KomunitasPage() {
  const router = useRouter();
  const [akun, setAkun] = useState<Akun | null>(null);
  const [checking, setChecking] = useState(true);
  const [posts, setPosts] = useState<PostKomunitas[]>([]);

  const [isiPost, setIsiPost] = useState("");
  const [komentarBuka, setKomentarBuka] = useState<Record<string, boolean>>({});
  const [isiKomentar, setIsiKomentar] = useState<Record<string, string>>({});

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
    setPosts(getPosts());
    setChecking(false);
  }, [router]);

  function handleKirimPost() {
    if (!akun || !isiPost.trim()) return;
    const baru: PostKomunitas = {
      id: "post-" + Date.now(),
      nama: akun.nama,
      foto: akun.foto,
      peran: akun.peran,
      isi: isiPost.trim(),
      waktu: new Date().toISOString(),
      komentar: [],
    };
    const updated = [baru, ...posts];
    simpanPosts(updated);
    setPosts(updated);
    setIsiPost("");
  }

  function handleKirimKomentar(postId: string) {
    if (!akun) return;
    const teks = (isiKomentar[postId] || "").trim();
    if (!teks) return;

    const komentarBaru: Komentar = {
      id: "kmt-" + Date.now(),
      nama: akun.nama,
      foto: akun.foto,
      isi: teks,
      waktu: new Date().toISOString(),
    };

    const updated = posts.map((p) =>
      p.id === postId ? { ...p, komentar: [...p.komentar, komentarBaru] } : p
    );
    simpanPosts(updated);
    setPosts(updated);
    setIsiKomentar((prev) => ({ ...prev, [postId]: "" }));
  }

  function toggleKomentar(postId: string) {
    setKomentarBuka((prev) => ({ ...prev, [postId]: !prev[postId] }));
  }

  if (checking || !akun) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-canvas">
        <p className="text-[13.5px] text-ink/50">Memuat...</p>
      </main>
    );
  }

  function Avatar({ nama, foto, size = 36 }: { nama: string; foto?: string; size?: number }) {
    return (
      <div
        style={{ width: size, height: size }}
        className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-sand"
      >
        {foto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={foto} alt={nama} className="h-full w-full object-cover" />
        ) : (
          <span className="text-[12px] font-semibold text-ink/50">
            {nama.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-canvas">
      <AppNav active="komunitas" />

      <div className="mx-auto max-w-[720px] px-6 py-10">
        <h1 className="font-display text-[24px] font-bold text-ink">
          Komunitas
        </h1>
        <p className="mt-1.5 text-[13.5px] text-ink/55">
          Tempat pengajar dan pelajar Simbio berbagi cerita, tips, dan
          diskusi.
        </p>

        {/* Compose box */}
        <div className="mt-7 rounded-[1.5rem] border border-ink/10 bg-white p-5">
          <div className="flex gap-3">
            <Avatar nama={akun.nama} foto={akun.foto} />
            <textarea
              value={isiPost}
              onChange={(e) => setIsiPost(e.target.value)}
              placeholder="Bagikan sesuatu ke komunitas..."
              rows={2}
              className="w-full resize-none rounded-xl border border-ink/15 px-4 py-2.5 text-[13.5px] leading-[1.5] outline-none focus:border-cobalt"
            />
          </div>
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleKirimPost}
              disabled={!isiPost.trim()}
              className="rounded-full bg-gradient-to-r from-teal to-cobalt px-6 py-2.5 text-[13.5px] font-semibold text-white transition-transform duration-300 ease-smooth hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            >
              Posting
            </button>
          </div>
        </div>

        {/* Feed */}
        <div className="mt-7 space-y-5">
          {posts.map((post) => (
            <div key={post.id} className="rounded-[1.5rem] border border-ink/10 bg-white p-6">
              <div className="flex items-start gap-3">
                <Avatar nama={post.nama} foto={post.foto} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[13.5px] font-semibold text-ink">{post.nama}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${
                        post.peran === "pengajar"
                          ? "bg-cobalt-tint text-cobalt-deep"
                          : "bg-teal-tint text-teal-deep"
                      }`}
                    >
                      {post.peran === "pengajar" ? "Pengajar" : "Pelajar"}
                    </span>
                    <span className="text-[12px] text-ink/40">
                      {formatWaktuRelatif(post.waktu)}
                    </span>
                  </div>
                  {post.kelasTag && (
                    <span className="mt-1.5 inline-block rounded-full bg-sand px-2.5 py-1 text-[11px] font-medium text-ink/55">
                      {post.kelasTag}
                    </span>
                  )}
                  <p className="mt-2 text-[13.5px] leading-[1.6] text-ink/75">
                    {post.isi}
                  </p>

                  <button
                    onClick={() => toggleKomentar(post.id)}
                    className="mt-3 text-[12.5px] font-semibold text-ink/45 hover:text-ink"
                  >
                    💬 {post.komentar.length} komentar
                  </button>

                  {komentarBuka[post.id] && (
                    <div className="mt-4 space-y-3 border-t border-ink/8 pt-4">
                      {post.komentar.map((k) => (
                        <div key={k.id} className="flex gap-2.5">
                          <Avatar nama={k.nama} foto={k.foto} size={28} />
                          <div className="rounded-2xl bg-canvas px-3.5 py-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[12.5px] font-semibold text-ink">
                                {k.nama}
                              </span>
                              <span className="text-[11px] text-ink/40">
                                {formatWaktuRelatif(k.waktu)}
                              </span>
                            </div>
                            <p className="text-[12.5px] leading-[1.5] text-ink/70">{k.isi}</p>
                          </div>
                        </div>
                      ))}

                      <div className="flex gap-2.5 pt-1">
                        <Avatar nama={akun.nama} foto={akun.foto} size={28} />
                        <div className="flex flex-1 gap-2">
                          <input
                            value={isiKomentar[post.id] || ""}
                            onChange={(e) =>
                              setIsiKomentar((prev) => ({ ...prev, [post.id]: e.target.value }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleKirimKomentar(post.id);
                            }}
                            placeholder="Tulis komentar..."
                            className="w-full rounded-full border border-ink/15 px-4 py-2 text-[12.5px] outline-none focus:border-cobalt"
                          />
                          <button
                            onClick={() => handleKirimKomentar(post.id)}
                            className="shrink-0 text-[12.5px] font-semibold text-cobalt-deep"
                          >
                            Kirim
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
