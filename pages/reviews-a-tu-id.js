import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Nav from "../components/Nav";

const PRECIO_UNIDAD = 800;         // 8 € por review (pago único)
const PRECIO_MENSUAL_UNIDAD = 600; // 6 € por review al mes (suscripción)
const MINIMO = 5;
const ATAJOS = [5, 10, 20, 50];

export default function ReviewsATuId() {
  const [modo, setModo] = useState("unico"); // 'unico' | 'suscripcion'
  const [cantidad, setCantidad] = useState(5);
  const [targetId, setTargetId] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const router = useRouter();

  const n = Number(cantidad) || 0;
  const totalUnico = n * PRECIO_UNIDAD;
  const totalMensual = n * PRECIO_MENSUAL_UNIDAD;

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => {
      if (d.user) setEmail(d.user.email);
    });
  }, []);

  function actualizarCantidad(valor) {
    const v = Number(valor);
    if (Number.isNaN(v)) return setCantidad("");
    setCantidad(v);
  }

  async function comprar(e) {
    e.preventDefault();
    if (!n || n < MINIMO) return setStatus({ error: `El mínimo es ${MINIMO} reviews.` });
    if (!email.trim()) return setStatus({ error: "Indica tu email." });
    if (!targetId.trim()) return setStatus({ error: "Indica el ID de tu cuenta." });

    setStatus("cargando");
    const ref = router.query.ref || (typeof window !== "undefined" ? localStorage.getItem("rv_ref") : null);

    const endpoint = modo === "unico" ? "/api/stripe/checkout-reviews-id" : "/api/stripe/checkout-suscripcion";
    const body = modo === "unico"
      ? { email, package: n, targetId, ref }
      : { email, type: "reviews_id", targetId, reviewsPerMonth: n, ref };

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
      <Head><title>Reviews a tu propia cuenta — ReviewVault</title></Head>
      <Nav />
      <main className="min-h-screen bg-page pb-28 md:pb-10">
        <div className="mx-auto max-w-2xl px-5 py-8">
          <p className="text-xs font-500 text-mist">Inicio / A tu propio ID</p>
          <h1 className="mt-1 font-display text-2xl font-700 text-ink">Reviews a tu propia cuenta</h1>
          <p className="mt-2 text-sm leading-relaxed text-mist">
            Elige cuántas quieres, desde {MINIMO}. Puedes pagarlas una vez o
            recibirlas cada mes automáticamente.
          </p>

          <form onSubmit={comprar} className="mt-8 rounded-2xl border border-line bg-surface p-6">
            {/* Selector pago único / suscripción */}
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-page p-1">
              <button type="button" onClick={() => setModo("unico")}
                className={`rounded-lg py-2 text-xs font-600 transition ${modo === "unico" ? "bg-surface text-ink shadow-sm" : "text-mist"}`}>
                Pago único
              </button>
              <button type="button" onClick={() => setModo("suscripcion")}
                className={`rounded-lg py-2 text-xs font-600 transition ${modo === "suscripcion" ? "bg-surface text-ink shadow-sm" : "text-mist"}`}>
                Cada mes
              </button>
            </div>

            <label className="mt-5 block text-xs font-600 uppercase tracking-wide text-mist">
              {modo === "unico" ? "Cantidad de reviews" : "Reviews al mes"}
            </label>
            <div className="mt-3 flex items-center gap-3">
              <button type="button" onClick={() => setCantidad((c) => Math.max(MINIMO, Number(c || MINIMO) - 1))}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-lg text-ink hover:border-teal hover:text-teal">−</button>
              <input type="number" min={MINIMO} value={cantidad}
                onChange={(e) => actualizarCantidad(e.target.value)}
                onBlur={() => setCantidad((c) => Math.max(MINIMO, Number(c) || MINIMO))}
                className="w-24 rounded-xl border border-line bg-page px-3 py-3 text-center font-display text-lg font-700 text-ink outline-none focus:border-teal" />
              <button type="button" onClick={() => setCantidad((c) => Math.max(MINIMO, Number(c || MINIMO) + 1))}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-lg text-ink hover:border-teal hover:text-teal">+</button>
              <span className="text-xs text-mist">mínimo {MINIMO}</span>
            </div>

            <div className="mt-3 flex gap-2">
              {ATAJOS.map((a) => (
                <button type="button" key={a} onClick={() => setCantidad(a)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-500 transition ${
                    Number(cantidad) === a ? "border-teal bg-tealSoft text-tealDark" : "border-line text-mist hover:border-teal/60"
                  }`}>
                  {a}
                </button>
              ))}
            </div>

            {modo === "suscripcion" && (
              <p className="mt-3 text-xs leading-relaxed text-mist">
                Recibirás {cantidad || 0} reviews cada mes, repartidas a lo
                largo del mes. Cancela cuando quieras.
              </p>
            )}

            <label className="mt-6 block text-xs font-600 uppercase tracking-wide text-mist">ID de tu cuenta</label>
            <input value={targetId} onChange={(e) => setTargetId(e.target.value)} placeholder="Ej. 8842193"
              className="mt-2 w-full rounded-xl border border-line bg-page px-4 py-3 text-sm text-ink outline-none focus:border-teal" />

            <label className="mt-5 block text-xs font-600 uppercase tracking-wide text-mist">
              Tu email (para enviarte las instrucciones)
            </label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com"
              className="mt-2 w-full rounded-xl border border-line bg-page px-4 py-3 text-sm text-ink outline-none focus:border-teal" />

            {modo === "unico" ? (
              <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
                <span className="text-sm text-mist">{n} × 8 €</span>
                <span className="font-display text-xl font-700 text-ink">{(totalUnico / 100).toFixed(2)} €</span>
              </div>
            ) : (
              <div className="mt-6 space-y-1 border-t border-line pt-4 text-sm">
                <div className="flex justify-between text-mist">
                  <span>Cuota de alta (mes 1) — {n} × 8 €</span>
                  <span>{(totalUnico / 100).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between pt-1 font-display text-lg font-700 text-ink">
                  <span>Después, al mes</span>
                  <span>{(totalMensual / 100).toFixed(2)} €/mes</span>
                </div>
              </div>
            )}

            <button type="submit" className="mt-5 w-full rounded-full bg-teal py-3 text-sm font-600 text-white transition hover:bg-tealDark">
              {modo === "unico"
                ? `Pagar ${(totalUnico / 100).toFixed(2)} €`
                : `Empezar por ${(totalUnico / 100).toFixed(2)} € + ${(totalMensual / 100).toFixed(2)} €/mes`}
            </button>
            <p className="mt-2 text-center text-xs text-mist">No hace falta crear cuenta para comprar</p>
            {status === "cargando" && <p className="mt-3 text-center text-xs text-mist">Procesando…</p>}
            {status?.error && <p className="mt-3 text-center text-xs text-coral">{status.error}</p>}
          </form>
        </div>
      </main>
    </>
  );
}
