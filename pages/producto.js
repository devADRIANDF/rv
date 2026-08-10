import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Nav from "../components/Nav";
import ListingCard from "../components/ListingCard";

const TIERS = [
  { n: 5, price: 5000, label: "50 €" },
  { n: 10, price: 9000, label: "90 €" },
  { n: 15, price: 12500, label: "125 €" },
  { n: 20, price: 16000, label: "160 €" },
];
const PRECIO_EXTRA = 900;       // 9 € por review adicional al tramo (pago único)
const PRECIO_MENSUAL_UNIDAD = 600; // 6 € por review al mes (suscripción)

export default function Producto() {
  const [modo, setModo] = useState("unico"); // 'unico' | 'suscripcion'
  const [selected, setSelected] = useState(15);
  const [extra, setExtra] = useState(0);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const router = useRouter();

  const tier = TIERS.find((t) => t.n === selected);
  const totalUnico = tier.price + extra * PRECIO_EXTRA;
  const totalMensual = selected * PRECIO_MENSUAL_UNIDAD;

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => {
      if (d.user) setEmail(d.user.email);
    });
  }, []);

  async function comprar(e) {
    e.preventDefault();
    if (!email.trim()) return setStatus({ error: "Indica tu email para recibir el pedido." });
    setStatus("cargando");
    const ref = router.query.ref || (typeof window !== "undefined" ? localStorage.getItem("rv_ref") : null);

    const endpoint = modo === "unico" ? "/api/stripe/checkout-cuenta" : "/api/stripe/checkout-suscripcion";
    const body = modo === "unico"
      ? { email, tier: selected, extra, ref }
      : { email, type: "cuenta", reviewsPerMonth: selected, ref };

    const r = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    if (!r.ok) return setStatus({ error: data.error });
    window.location.href = data.url;
  }

  return (
    <>
      <Head><title>Cuentas en venta — ReviewVault</title></Head>
      <Nav />
      <main className="min-h-screen bg-page pb-28 md:pb-10">
        <div className="mx-auto max-w-6xl px-5 py-8">
          <p className="text-xs font-500 text-mist">Inicio / Cuentas</p>
          <h1 className="mt-1 font-display text-2xl font-700 text-ink">Cuentas en venta</h1>
          <p className="mt-1 text-sm text-mist">4 anuncios disponibles</p>

          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {TIERS.map((t) => (
              <ListingCard
                key={t.n}
                n={t.n}
                price={t.label}
                selected={selected === t.n}
                onClick={() => setSelected(t.n)}
              />
            ))}
          </div>

          <form onSubmit={comprar} className="mt-10 max-w-md rounded-2xl border border-line bg-surface p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-tealSoft font-display text-lg font-700 text-tealDark">
                {tier.n}
              </span>
              <div>
                <p className="font-display text-base font-600 text-ink">Cuenta · {tier.n} reviews</p>
                <p className="text-xs text-mist">Entrega en un plazo máximo de 2 semanas</p>
              </div>
            </div>

            {/* Selector pago único / suscripción */}
            <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-page p-1">
              <button
                type="button"
                onClick={() => setModo("unico")}
                className={`rounded-lg py-2 text-xs font-600 transition ${modo === "unico" ? "bg-surface text-ink shadow-sm" : "text-mist"}`}
              >
                Pago único
              </button>
              <button
                type="button"
                onClick={() => setModo("suscripcion")}
                className={`rounded-lg py-2 text-xs font-600 transition ${modo === "suscripcion" ? "bg-surface text-ink shadow-sm" : "text-mist"}`}
              >
                Suscripción mensual
              </button>
            </div>

            {modo === "unico" ? (
              <div className="mt-5 border-t border-line pt-4">
                <label className="text-xs font-600 uppercase tracking-wide text-mist">
                  ¿Quieres añadir reviews de más? (9 € cada una)
                </label>
                <div className="mt-3 flex items-center gap-3">
                  <button type="button" onClick={() => setExtra((e) => Math.max(0, e - 1))}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-lg text-ink hover:border-teal hover:text-teal">−</button>
                  <input type="number" min={0} value={extra}
                    onChange={(e) => setExtra(Math.max(0, Number(e.target.value) || 0))}
                    className="w-20 rounded-xl border border-line bg-page px-3 py-2 text-center font-display text-base font-700 text-ink outline-none focus:border-teal" />
                  <button type="button" onClick={() => setExtra((e) => e + 1)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-lg text-ink hover:border-teal hover:text-teal">+</button>
                  <span className="text-xs text-mist">reviews extra</span>
                </div>
              </div>
            ) : (
              <p className="mt-5 border-t border-line pt-4 text-sm leading-relaxed text-mist">
                Cada mes recibirás {selected} reviews más en tu cuenta,
                repartidas a lo largo del mes. Cancela cuando quieras.
              </p>
            )}

            <label className="mt-5 block text-xs font-600 uppercase tracking-wide text-mist">
              Tu email (para enviarte el pedido)
            </label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              className="mt-2 w-full rounded-xl border border-line bg-page px-4 py-3 text-sm text-ink outline-none focus:border-teal" />

            {modo === "unico" ? (
              <div className="mt-5 space-y-1 border-t border-line pt-4 text-sm">
                <div className="flex justify-between text-mist">
                  <span>Cuenta con {tier.n} reviews</span>
                  <span>{tier.label}</span>
                </div>
                {extra > 0 && (
                  <div className="flex justify-between text-mist">
                    <span>{extra} reviews extra × 9 €</span>
                    <span>{(extra * PRECIO_EXTRA / 100).toFixed(2)} €</span>
                  </div>
                )}
                <div className="flex justify-between pt-1 font-display text-lg font-700 text-ink">
                  <span>Total hoy</span>
                  <span>{(totalUnico / 100).toFixed(2)} €</span>
                </div>
              </div>
            ) : (
              <div className="mt-5 space-y-1 border-t border-line pt-4 text-sm">
                <div className="flex justify-between text-mist">
                  <span>Cuota de alta (mes 1)</span>
                  <span>{(tier.price / 100).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between pt-1 font-display text-lg font-700 text-ink">
                  <span>Después, al mes</span>
                  <span>{(totalMensual / 100).toFixed(2)} €/mes</span>
                </div>
              </div>
            )}

            <button type="submit"
              className="mt-5 w-full rounded-full bg-teal py-3 text-sm font-600 text-white transition hover:bg-tealDark">
              {modo === "unico"
                ? `Pagar ${(totalUnico / 100).toFixed(2)} €`
                : `Empezar por ${(tier.price / 100).toFixed(2)} € + ${(totalMensual / 100).toFixed(2)} €/mes`}
            </button>
            <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-center text-xs text-amber-700">
              Esta cuenta se prepara bajo pedido: la entrega puede tardar
              hasta 2 semanas.
            </p>
            <p className="mt-2 text-center text-xs text-mist">No hace falta crear cuenta para comprar</p>
            {status === "cargando" && <p className="mt-3 text-center text-xs text-mist">Procesando…</p>}
            {status?.error && <p className="mt-3 text-center text-xs text-coral">{status.error}</p>}
          </form>
        </div>
      </main>
    </>
  );
}
