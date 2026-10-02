// Semua tipe data, data contoh (mock), dan helper localStorage yang
// dipakai bersama oleh halaman-halaman area login (dashboard, aktivitas,
// komunitas, profil, dst). Karena belum ada backend, "database"-nya
// adalah localStorage di browser masing-masing.

export type Peran = "pengajar" | "pelajar";

export type Akun = {
  peran: Peran;
  nama: string;
  email: string;
  password: string;
  pilihan: string[];
  pengalaman?: string;
  portofolio?: string;
  asalInstansi?: string;
  jenjang?: string;
  foto?: string;
  bio?: string;
  linkSosial?: string;
  profilLengkap?: boolean;
};

export type Kategori = "Dasar" | "Menengah" | "Mahir";

export type Kelas = {
  id: string;
  judul: string;
  bidang: string;
  kategori: Kategori;
  harga: number;
  durasiMenit: number;
  output: string;
  media: string[];
  icon: string;
  pengajarNama: string;
  pengajarFoto?: string;
  pengajarRating: number;
  pengajarJumlahKelas: number;
  jadwalMulai: string; // ISO datetime
};

export type StatusPengajuan =
  | "menunggu"
  | "disetujui_belum_mulai"
  | "berlangsung"
  | "selesai"
  | "ditolak";

export type KelasPengajar = Kelas & {
  statusPengajuan: StatusPengajuan;
  jumlahPendaftar: number;
  reviewBintang5: number;
};

export type StatusAktivitas = "diikuti" | "berlangsung" | "selesai" | "dibatalkan";

export type Ulasan = { rating: number; komentar: string };

export type AktivitasItem = {
  kelasId: string;
  status: StatusAktivitas;
  waktuDaftar: string;
  sudahBayar: boolean;
  ulasan?: Ulasan;
};

export type Komentar = {
  id: string;
  nama: string;
  foto?: string;
  isi: string;
  waktu: string;
};

export type PostKomunitas = {
  id: string;
  nama: string;
  foto?: string;
  peran: Peran;
  isi: string;
  kelasTag?: string;
  waktu: string;
  komentar: Komentar[];
};

export type Badge = {
  id: string;
  nama: string;
  deskripsi: string;
  icon: string;
};

// ---------------------------------------------------------------------
// Kunci localStorage
// ---------------------------------------------------------------------

export const KEY_AKUN = "simbio_pendaftaran";
export const KEY_AKTIVITAS = "simbio_aktivitas_pelajar";
export const KEY_KELAS_PENGAJAR = "simbio_kelas_pengajar";
export const KEY_POSTS = "simbio_komunitas_posts";
export const KEY_TOS = "simbio_tos_disetujui";
export const KEY_AKTIF_SEJAK = "simbio_aktif_sejak";

// Dipanggil sekali saat kelas pengajar pertama kali disetujui, jadi
// titik mulai untuk menghitung "sudah berapa lama aktif mengajar".
export function tandaiAktifSejak() {
  if (!localStorage.getItem(KEY_AKTIF_SEJAK)) {
    localStorage.setItem(KEY_AKTIF_SEJAK, new Date().toISOString());
  }
}

export function getAktifSejak(): string | null {
  return localStorage.getItem(KEY_AKTIF_SEJAK);
}

// ---------------------------------------------------------------------
// Data contoh (mock) — kelas yang tersedia untuk dicari pelajar.
// Jadwalnya dihitung relatif dari waktu sekarang supaya demo
// auto-transition (akan datang -> berlangsung -> selesai) kelihatan
// jalan beneran tanpa perlu nunggu tanggal asli.
// ---------------------------------------------------------------------

function jamDariSekarang(menit: number) {
  return new Date(Date.now() + menit * 60 * 1000).toISOString();
}

export function getSeedKelas(): Kelas[] {
  return [
    {
      id: "k1",
      judul: "Dasar-Dasar UI/UX untuk Pemula",
      bidang: "UI/UX Design",
      kategori: "Dasar",
      harga: 10000,
      durasiMenit: 90,
      output: "Peserta memahami prinsip dasar UI/UX dan mampu membuat wireframe sederhana.",
      media: ["Materi Presentasi", "Praktik"],
      icon: "🎨",
      pengajarNama: "Ahmad Ramadhan",
      pengajarRating: 4.8,
      pengajarJumlahKelas: 12,
      jadwalMulai: jamDariSekarang(60 * 24 * 2), // 2 hari lagi
    },
    {
      id: "k2",
      judul: "Belajar Python dari Nol",
      bidang: "Pemrograman Web",
      kategori: "Menengah",
      harga: 15000,
      durasiMenit: 3,
      output: "Peserta memahami sintaks dasar Python dan bisa membuat program sederhana.",
      media: ["Praktik", "Simulasi"],
      icon: "💻",
      pengajarNama: "Sinta Wulandari",
      pengajarRating: 4.6,
      pengajarJumlahKelas: 8,
      jadwalMulai: jamDariSekarang(2), // 2 menit lagi — buat demo auto-transition
    },
    {
      id: "k3",
      judul: "Conversational English untuk Wawancara",
      bidang: "Bahasa",
      kategori: "Menengah",
      harga: 15000,
      durasiMenit: 60,
      output: "Peserta lebih percaya diri berbicara bahasa Inggris dalam konteks wawancara kerja.",
      media: ["Praktik"],
      icon: "🗣️",
      pengajarNama: "Raka Pratama",
      pengajarRating: 4.9,
      pengajarJumlahKelas: 20,
      jadwalMulai: jamDariSekarang(-60 * 5), // 5 jam lalu — sudah otomatis "selesai"
    },
    {
      id: "k4",
      judul: "Fotografi Produk dengan Smartphone",
      bidang: "Fotografi",
      kategori: "Dasar",
      harga: 10000,
      durasiMenit: 60,
      output: "Peserta mampu memotret produk dengan pencahayaan sederhana memakai smartphone.",
      media: ["Praktik", "Simulasi"],
      icon: "📷",
      pengajarNama: "Dinda Nuraini",
      pengajarRating: 4.7,
      pengajarJumlahKelas: 6,
      jadwalMulai: jamDariSekarang(60 * 24), // besok
    },
    {
      id: "k5",
      judul: "Public Speaking untuk Presentasi Kuliah",
      bidang: "Public Speaking",
      kategori: "Mahir",
      harga: 22000,
      durasiMenit: 90,
      output: "Peserta mampu menyusun dan membawakan presentasi akademik dengan percaya diri.",
      media: ["Materi Presentasi", "Praktik"],
      icon: "🎤",
      pengajarNama: "Bagas Trianto",
      pengajarRating: 4.5,
      pengajarJumlahKelas: 15,
      jadwalMulai: jamDariSekarang(60 * 24 * 3), // 3 hari lagi
    },
    {
      id: "k6",
      judul: "React untuk Pemula",
      bidang: "Pemrograman Web",
      kategori: "Mahir",
      harga: 22000,
      durasiMenit: 120,
      output: "Peserta mampu membangun antarmuka sederhana menggunakan React.",
      media: ["Materi Presentasi", "Praktik", "Simulasi"],
      icon: "⚛️",
      pengajarNama: "Sinta Wulandari",
      pengajarRating: 4.6,
      pengajarJumlahKelas: 8,
      jadwalMulai: jamDariSekarang(60 * 24 * 7), // seminggu lagi
    },
  ];
}

export function getSeedPosts(): PostKomunitas[] {
  const jamLalu = (j: number) => new Date(Date.now() - j * 60 * 60 * 1000).toISOString();
  return [
    {
      id: "p1",
      nama: "Sinta Wulandari",
      peran: "pengajar",
      isi: "Ada yang mau request kelas lanjutan JavaScript setelah kelas Python? Kasih tau kalau berminat ya!",
      kelasTag: "Pemrograman Web",
      waktu: jamLalu(3),
      komentar: [
        {
          id: "c1",
          nama: "Ahmad Ramadhan",
          isi: "Wah menarik, aku ikut kalau ada kak!",
          waktu: jamLalu(2),
        },
      ],
    },
    {
      id: "p2",
      nama: "Raka Pratama",
      peran: "pengajar",
      isi: "Tips kecil buat yang mau interview pakai bahasa Inggris: latihan jawab pertanyaan umum di depan cermin, bantu banget buat ngurangin gugup.",
      waktu: jamLalu(20),
      komentar: [],
    },
    {
      id: "p3",
      nama: "Dinda Nuraini",
      peran: "pengajar",
      isi: "Baru selesai kelas fotografi produk pertama, seru banget liat hasil jepretan peserta. Makasih yang udah ikut!",
      kelasTag: "Fotografi",
      waktu: jamLalu(30),
      komentar: [
        { id: "c2", nama: "Bagas Trianto", isi: "Keren kak, semoga makin banyak yang ikut!", waktu: jamLalu(28) },
      ],
    },
  ];
}

export function getSeedBadges(peran: Peran): Badge[] {
  if (peran === "pengajar") {
    return [
      { id: "b-pengajar-baru", nama: "Sang Perintis", deskripsi: "Melengkapi profil sebagai pengajar di Simbio", icon: "🌱" },
      { id: "b-kelas-pertama", nama: "Kelas Perdana", deskripsi: "Satu kelas berhasil disetujui tim Simbio", icon: "✅" },
      { id: "b-berpengalaman", nama: "Maestro Simbio", deskripsi: "5 kelas telah selesai diajarkan", icon: "🏆" },
    ];
  }
  return [
    { id: "b-pelajar-baru", nama: "Langkah Awal", deskripsi: "Melengkapi profil sebagai pelajar di Simbio", icon: "🌱" },
    { id: "b-kelas-pertama", nama: "Wisuda Pertama", deskripsi: "Menyelesaikan kelas pertama di Simbio", icon: "🎓" },
    { id: "b-pelajar-aktif", nama: "Kutu Belajar", deskripsi: "Menyelesaikan 3 kelas di Simbio", icon: "⭐" },
  ];
}

// ---------------------------------------------------------------------
// Helper format tampilan
// ---------------------------------------------------------------------

export function formatRupiah(n: number) {
  return "Rp" + n.toLocaleString("id-ID");
}

export function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function formatJam(iso: string) {
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatWaktuRelatif(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffJam = Math.floor(diffMin / 60);
  if (diffJam < 24) return `${diffJam} jam lalu`;
  const diffHari = Math.floor(diffJam / 24);
  return `${diffHari} hari lalu`;
}

// Mengecilkan gambar ke maksimal `maxSize` px sebelum disimpan sebagai
// data URL, supaya tidak membengkak di localStorage.
export function resizeImage(file: File, maxSize = 300): Promise<string> {
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

// Status kelas dihitung dari waktu sekarang dibanding jadwal + durasi.
export function statusWaktuKelas(
  jadwalMulai: string,
  durasiMenit: number
): "akan_datang" | "berlangsung" | "selesai" {
  const mulai = new Date(jadwalMulai).getTime();
  const selesai = mulai + durasiMenit * 60 * 1000;
  const now = Date.now();
  if (now < mulai) return "akan_datang";
  if (now < selesai) return "berlangsung";
  return "selesai";
}

// ---------------------------------------------------------------------
// Helper localStorage — akun
// ---------------------------------------------------------------------

export function getAkun(): Akun | null {
  try {
    const saved = localStorage.getItem(KEY_AKUN);
    return saved ? (JSON.parse(saved) as Akun) : null;
  } catch {
    return null;
  }
}

export function simpanAkun(akun: Akun) {
  localStorage.setItem(KEY_AKUN, JSON.stringify(akun));
}

// ---------------------------------------------------------------------
// Helper localStorage — aktivitas pelajar
// ---------------------------------------------------------------------

export function getAktivitas(): AktivitasItem[] {
  try {
    const saved = localStorage.getItem(KEY_AKTIVITAS);
    return saved ? (JSON.parse(saved) as AktivitasItem[]) : [];
  } catch {
    return [];
  }
}

export function simpanAktivitas(items: AktivitasItem[]) {
  localStorage.setItem(KEY_AKTIVITAS, JSON.stringify(items));
}

// Menyamakan status aktivitas pelajar dengan waktu sekarang.
// Dipanggil di setiap halaman yang menampilkan aktivitas, supaya kelas
// yang jadwalnya sudah lewat otomatis pindah status.
export function sinkronAktivitas(): AktivitasItem[] {
  const items = getAktivitas();
  const seed = getSeedKelas();
  let berubah = false;

  const hasil = items.map((item) => {
    if (item.status === "dibatalkan") return item;
    const kelas = seed.find((k) => k.id === item.kelasId);
    if (!kelas) return item;
    const statusWaktu = statusWaktuKelas(kelas.jadwalMulai, kelas.durasiMenit);
    const statusBaru: StatusAktivitas =
      statusWaktu === "selesai" ? "selesai" : statusWaktu === "berlangsung" ? "berlangsung" : "diikuti";
    if (statusBaru !== item.status) {
      berubah = true;
      return { ...item, status: statusBaru };
    }
    return item;
  });

  if (berubah) simpanAktivitas(hasil);
  return hasil;
}

// ---------------------------------------------------------------------
// Helper localStorage — kelas yang diajukan pengajar
// ---------------------------------------------------------------------

export function getKelasPengajar(): KelasPengajar[] {
  try {
    const saved = localStorage.getItem(KEY_KELAS_PENGAJAR);
    return saved ? (JSON.parse(saved) as KelasPengajar[]) : [];
  } catch {
    return [];
  }
}

export function simpanKelasPengajar(items: KelasPengajar[]) {
  localStorage.setItem(KEY_KELAS_PENGAJAR, JSON.stringify(items));
}

// Menyamakan status pengajuan kelas pengajar dengan waktu sekarang
// (untuk kelas yang statusnya sudah "disetujui_belum_mulai").
export function sinkronKelasPengajar(): KelasPengajar[] {
  const items = getKelasPengajar();
  let berubah = false;

  const hasil = items.map((kelas) => {
    if (kelas.statusPengajuan === "menunggu" || kelas.statusPengajuan === "ditolak") {
      return kelas;
    }
    const statusWaktu = statusWaktuKelas(kelas.jadwalMulai, kelas.durasiMenit);
    const statusBaru: StatusPengajuan =
      statusWaktu === "selesai" ? "selesai" : statusWaktu === "berlangsung" ? "berlangsung" : "disetujui_belum_mulai";
    if (statusBaru !== kelas.statusPengajuan) {
      berubah = true;
      return { ...kelas, statusPengajuan: statusBaru };
    }
    return kelas;
  });

  if (berubah) simpanKelasPengajar(hasil);
  return hasil;
}

// ---------------------------------------------------------------------
// Helper localStorage — komunitas
// ---------------------------------------------------------------------

export function getPosts(): PostKomunitas[] {
  try {
    const saved = localStorage.getItem(KEY_POSTS);
    if (saved) return JSON.parse(saved) as PostKomunitas[];
    const seed = getSeedPosts();
    localStorage.setItem(KEY_POSTS, JSON.stringify(seed));
    return seed;
  } catch {
    return getSeedPosts();
  }
}

export function simpanPosts(posts: PostKomunitas[]) {
  localStorage.setItem(KEY_POSTS, JSON.stringify(posts));
}
