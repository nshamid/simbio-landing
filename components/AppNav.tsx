"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAkun, KEY_AKUN, type Akun } from "@/lib/simbio-data";

type Section = "dashboard" | "aktivitas" | "pendapatan" | "komunitas" | "acara" | "profil";

export default function AppNav({ active }: { active: Section }) {
  const router = useRouter();
  const [akun, setAkun] = useState<Akun | null>(null);

  useEffect(() => {
    setAkun(getAkun());
  }, []);

  function handleKeluar() {
    localStorage.removeItem(KEY_AKUN);
    router.push("/");
  }

  if (!akun) return null;

  const isPengajar = akun.peran === "pengajar";
  const dashboardHref = isPengajar ? "/pengajar/dashboard" : "/pelajar/dashboard";

  const items: { key: Section; label: string; href: string }[] = [
    { key: "dashboard", label: "Dashboard", href: dashboardHref },
    isPengajar
      ? { key: "pendapatan", label: "Pendapatan", href: "/pengajar/pendapatan" }
      : { key: "aktivitas", label: "Aktivitas", href: "/pelajar/aktivitas" },
    { key: "komunitas", label: "Komunitas", href: "/komunitas" },
    { key: "acara", label: "Acara", href: "/acara" },
    { key: "profil", label: "Profil Saya", href: "/profil-saya" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-ink/[0.06] bg-white">
      <div className="mx-auto flex h-[68px] max-w-[1180px] items-center justify-between px-6">
        <Link href={dashboardHref} className="flex items-center gap-2.5">
          <Image src="/logo-icon.png" alt="Simbio" width={26} height={24} />
          <span className="font-display text-[16.5px] font-bold text-ink">
            Simbio
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-[13.5px] sm:flex">
          {items.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={
                active === item.key
                  ? "font-semibold text-ink"
                  : "text-ink/50 hover:text-ink"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/profil-saya"
            className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-sand"
          >
            {akun.foto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={akun.foto}
                alt={akun.nama}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-[12px] font-semibold text-ink/50">
                {akun.nama.charAt(0).toUpperCase()}
              </span>
            )}
          </Link>
          <button
            onClick={handleKeluar}
            className="hidden text-[13.5px] font-medium text-ink/60 hover:text-ink sm:block"
          >
            Keluar
          </button>
        </div>
      </div>

      {/* Nav versi mobile, scroll ke samping */}
      <nav className="flex gap-5 overflow-x-auto border-t border-ink/[0.06] px-6 py-2.5 text-[13px] sm:hidden">
        {items.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={
              active === item.key
                ? "shrink-0 font-semibold text-ink"
                : "shrink-0 text-ink/50"
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
