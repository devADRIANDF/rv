import Link from "next/link";

function CardBody({ n, price }) {
  return (
    <>
      <div className="relative flex aspect-square items-center justify-center rounded-xl border border-line bg-tealSoft/60 transition group-hover:border-teal/60">
        <span className="font-display text-4xl font-700 text-tealDark">{n}</span>
        <span className="absolute bottom-2 left-2 rounded-full bg-white px-2.5 py-1 text-xs font-600 text-ink shadow-sm">
          {price}
        </span>
      </div>
      <p className="mt-2 text-sm font-600 text-ink">Cuenta · {n} reviews</p>
      <p className="mt-0.5 flex items-center gap-1 text-xs text-mist">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-teal">
          <circle cx="12" cy="12" r="10" /><path d="M8 12l3 3 5-6" />
        </svg>
        Vendido por ReviewVault
      </p>
    </>
  );
}

// Variante enlace: para listados que llevan a otra página (home)
export function ListingLink({ n, price, href }) {
  return (
    <Link href={href} className="group block text-left">
      <CardBody n={n} price={price} />
    </Link>
  );
}

// Variante seleccionable: para elegir un paquete dentro de la misma página (producto)
export default function ListingCard({ n, price, selected, onClick }) {
  return (
    <button type="button" onClick={onClick} className="group block text-left">
      <div
        className={`relative flex aspect-square items-center justify-center rounded-xl border transition ${
          selected ? "border-teal bg-tealSoft ring-2 ring-teal" : "border-line bg-tealSoft/60 group-hover:border-teal/60"
        }`}
      >
        <span className="font-display text-4xl font-700 text-tealDark">{n}</span>
        <span className="absolute bottom-2 left-2 rounded-full bg-white px-2.5 py-1 text-xs font-600 text-ink shadow-sm">
          {price}
        </span>
        {selected && (
          <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-teal text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
          </span>
        )}
      </div>
      <p className="mt-2 text-sm font-600 text-ink">Cuenta · {n} reviews</p>
      <p className="mt-0.5 flex items-center gap-1 text-xs text-mist">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-teal">
          <circle cx="12" cy="12" r="10" /><path d="M8 12l3 3 5-6" />
        </svg>
        Vendido por ReviewVault
      </p>
    </button>
  );
}
