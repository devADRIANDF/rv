import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Nav() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setUser(d.user));
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-3">
          <Link href="/" className="flex shrink-0 items-center gap-2 font-display text-xl font-700 text-ink">
            Review<span className="text-teal">Vault</span>
          </Link>

          <nav className="ml-auto hidden items-center gap-6 md:flex">
            <Link href="/producto" className="text-sm font-500 text-ink hover:text-teal">Cuentas</Link>
            <Link href="/reviews-a-tu-id" className="text-sm font-500 text-ink hover:text-teal">A tu ID</Link>
            <Link href="/ayuda" className="text-sm font-500 text-ink hover:text-teal">Ayuda</Link>
            <a href="https://t.me/tu_usuario" target="_blank" rel="noopener noreferrer" className="text-sm font-500 text-ink hover:text-teal">
              Telegram
            </a>
          </nav>

          {user ? (
            <Link
              href="/panel"
              className="ml-auto flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm font-500 text-ink hover:border-teal hover:text-teal md:ml-0"
            >
              <span className="hidden sm:inline">{(user.wallet_balance / 100).toFixed(2)} €</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-tealSoft text-xs font-600 text-tealDark">
                {user.email[0].toUpperCase()}
              </span>
            </Link>
          ) : (
            <Link href="/login" className="ml-auto text-sm font-500 text-mist hover:text-ink md:ml-0">
              Acceder
            </Link>
          )}
        </div>
      </header>

      {/* Barra inferior fija en móvil */}
      <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-line bg-surface py-2 md:hidden">
        <Link href="/" className={`flex flex-col items-center gap-0.5 px-2 ${router.pathname === "/" ? "text-teal" : "text-mist"}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l9-8 9 8v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
          <span className="text-[10px]">Inicio</span>
        </Link>
        <Link href="/producto" className={`flex flex-col items-center gap-0.5 px-2 ${router.pathname === "/producto" ? "text-teal" : "text-mist"}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
          <span className="text-[10px]">Cuentas</span>
        </Link>
        <Link href="/reviews-a-tu-id" aria-label="Comprar reviews para tu cuenta" className="flex flex-col items-center gap-0.5 px-2 text-mist">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
          </span>
        </Link>
        <Link href="/ayuda" className={`flex flex-col items-center gap-0.5 px-2 ${router.pathname === "/ayuda" ? "text-teal" : "text-mist"}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.5 9a2.5 2.5 0 015 .5c0 1.5-2 1.7-2 3.5" /><circle cx="12" cy="17" r=".5" fill="currentColor" /></svg>
          <span className="text-[10px]">Ayuda</span>
        </Link>
        <Link href={user ? "/panel" : "/login"} className={`flex flex-col items-center gap-0.5 px-2 ${router.pathname === "/panel" ? "text-teal" : "text-mist"}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>
          <span className="text-[10px]">Cuenta</span>
        </Link>
      </nav>
    </>
  );
}
