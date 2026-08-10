import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface pb-24 pt-6 md:pb-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 text-xs text-mist">
        <span>© {new Date().getFullYear()} ReviewVault</span>
        <div className="flex flex-wrap gap-4">
          <Link href="/ayuda" className="hover:text-ink">Ayuda</Link>
          <a href="https://t.me/tu_usuario" target="_blank" rel="noopener noreferrer" className="hover:text-ink">Telegram</a>
          <Link href="/legal/aviso-legal" className="hover:text-ink">Aviso legal</Link>
          <Link href="/legal/privacidad" className="hover:text-ink">Privacidad</Link>
          <Link href="/legal/condiciones" className="hover:text-ink">Condiciones de venta</Link>
        </div>
      </div>
    </footer>
  );
}
