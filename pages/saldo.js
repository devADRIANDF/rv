import Head from "next/head";
import { useState } from "react";
import Nav from "../components/Nav";

const PRESETS = [10, 25, 50, 100];

export default function Saldo() {
  const [amount, setAmount] = useState(50);
  const [status, setStatus] = useState(null);

  async function recargar(e) {
    e.preventDefault();
    setStatus("cargando");
    const r = await fetch("/api/stripe/checkout-wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amountEuros: amount }),
    });
    const data = await r.json();
    if (!r.ok) return setStatus({ error: data.error });
    window.location.href = data.url;
  }

  return (
    <>
      <Head><title>Monedero — ReviewVault</title></Head>
      <Nav />
      <main className="min-h-screen bg-page pb-28 md:pb-10">
        <div className="mx-auto max-w-md px-5 py-8">
          <p className="text-xs font-500 text-mist">Inicio / Monedero</p>
          <h1 className="mt-1 font-display text-2xl font-700 text-ink">Tu monedero</h1>
          <p className="mt-2 text-sm leading-relaxed text-mist">
            Recarga una vez y úsalo en tus próximas compras sin repetir el
            proceso de pago cada vez.
          </p>

          <form onSubmit={recargar} className="mt-8 rounded-2xl border border-line bg-surface p-6">
            <label className="text-xs font-600 uppercase tracking-wide text-mist">Cantidad a recargar</label>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {PRESETS.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setAmount(p)}
                  className={`rounded-xl border py-3 text-center font-display text-sm font-600 transition ${
                    amount === p ? "border-teal bg-tealSoft text-tealDark" : "border-line bg-page text-ink hover:border-teal/60"
                  }`}
                >
                  {p} €
                </button>
              ))}
            </div>
            <label className="mt-5 block text-xs font-600 uppercase tracking-wide text-mist">O elige otro importe</label>
            <input
              type="number"
              min={5}
              max={500}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-2 w-full rounded-xl border border-line bg-page px-4 py-3 text-sm text-ink outline-none focus:border-teal"
            />
            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-teal py-3 text-sm font-600 text-white transition hover:bg-tealDark"
            >
              Recargar {amount} €
            </button>
            {status === "cargando" && <p className="mt-3 text-center text-xs text-mist">Procesando…</p>}
            {status?.error && <p className="mt-3 text-center text-xs text-coral">{status.error}</p>}
            {status?.ok && (
              <p className="mt-3 text-center text-xs font-500 text-teal">
                Saldo actualizado: {(status.balance / 100).toFixed(2)} €
              </p>
            )}
          </form>
        </div>
      </main>
    </>
  );
}
