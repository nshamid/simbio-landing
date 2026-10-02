import type { Kategori } from "@/lib/simbio-data";

// Warna chip kategori kelas. Nama kelas dipakai lengkap (bukan dirangkai)
// supaya Tailwind bisa mendeteksinya. File ini sengaja ada di folder
// components/ karena folder itu sudah dipindai Tailwind.
export function classKategori(k: Kategori): string {
  switch (k) {
    case "Dasar":
      return "bg-teal-tint text-teal-deep";
    case "Menengah":
      return "bg-cobalt-tint text-cobalt-deep";
    case "Mahir":
      return "bg-violet-100 text-violet-700";
    default:
      return "bg-sand text-ink/60";
  }
}

// Warna latar ikon kelas berdasarkan bidang.
export function classTileBidang(bidang: string): string {
  switch (bidang) {
    case "UI/UX Design":
      return "bg-pink-50";
    case "Pemrograman Web":
      return "bg-cobalt-tint";
    case "Bahasa":
      return "bg-amber-50";
    case "Public Speaking":
      return "bg-violet-50";
    case "Fotografi":
      return "bg-teal-tint";
    default:
      return "bg-canvas";
  }
}
