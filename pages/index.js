import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import Nav from "../components/Nav";
import { ListingLink } from "../components/ListingCard";

const LISTINGS = [
  { n: 5, price: "50 €" },
  { n: 10, price: "90 €" },
  { n: 15, price: "125 €" },
  { n: 20, price: "160 €" },
];

const FILTROS = ["Todo", "5", "10", "15", "20"];

export default function Home() {
  const [filtro, setFiltro] = useState("Todo");
  const visibles = filtro === "Todo" ? LISTINGS : LISTINGS.filter((l) => String(l.n) === filtro);

  return (
    <>
      <Head>
        <title>ReviewVault — Cuentas con valoraciones, directas del vendedor</title>
      </Head>
      <Nav />
      <main className="min-h-screen bg-page pb-20 md:pb-0">
        {/* HERO */}
        <section className="border-b border-line bg-surface">
          <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
            <h1 className="max-w-xl font-display text-3xl font-700 leading-tight text-ink md:text-4xl">
              Cuentas con valoraciones ya incluidas
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-mist md:text-base">
              Elige cuántas reviews necesitas y págalas al momento. Sin
              necesidad de crear cuenta, sin esperas.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/producto"
                className="rounded-full bg-teal px-6 py-3 text-sm font-600 text-white transition hover:bg-tealDark"
              >
                Ver cuentas en venta
              </Link>
              <Link
                href="/reviews-a-tu-id"
                className="rounded-full border border-line bg-surface px-6 py-3 text-sm font-600 text-ink transition hover:border-teal hover:text-teal"
              >
                Añadir reviews a mi cuenta
              </Link>
            </div>
          </div>
        </section>

        {/* FILTRO POR Nº DE REVIEWS */}
        <div className="mx-auto max-w-6xl px-5 pt-5">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {FILTROS.map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-500 transition ${
                  filtro === f ? "bg-teal text-white" : "border border-line bg-surface text-mist hover:border-teal/60"
                }`}
              >
                {f === "Todo" ? "Todo" : `${f} reviews`}
              </button>
            ))}
          </div>
        </div>

        {/* GRID DE CUENTAS */}
        <section className="mx-auto max-w-6xl px-5 py-8">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-display text-lg font-600 text-ink">Cuentas disponibles</h2>
            <Link href="/producto" className="text-xs font-500 text-teal hover:underline">Ver todo</Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
            {visibles.map((l) => (
              <ListingLink key={l.n} n={l.n} price={l.price} href="/producto" />
            ))}
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section className="border-y border-line bg-surface">
          <div className="mx-auto max-w-6xl px-5 py-12">
            <h2 className="font-display text-xl font-600 text-ink">Dos formas de comprar</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-line bg-page p-6">
                <span className="text-xs font-600 uppercase tracking-wide text-teal">Opción 1</span>
                <h3 className="mt-2 font-display text-base font-600 text-ink">Cuenta ya lista</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">
                  Eliges cuántas reviews quieres, pagas y recibes los datos
                  de acceso por email.
                </p>
              </div>
              <div className="rounded-xl border border-line bg-page p-6">
                <span className="text-xs font-600 uppercase tracking-wide text-teal">Opción 2</span>
                <h3 className="mt-2 font-display text-base font-600 text-ink">Reviews sueltas para tu cuenta</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">
                  Eliges exactamente cuántas quieres, a partir de 5, a 8 €
                  cada una. Mantienes tu cuenta actual; te escribimos por
                  email para completar la entrega.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AFILIADOS */}
        <section className="mx-auto max-w-6xl px-5 py-12">
          <div className="rounded-2xl bg-ink px-8 py-10 text-white md:px-12 md:py-14">
            <span className="text-xs font-600 uppercase tracking-wide text-teal">Programa de invitados</span>
            <h2 className="mt-2 max-w-md font-display text-2xl font-700">
              Comparte tu enlace, gana el 10% de cada compra
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
              Al crear tu cuenta obtienes un enlace propio. Cuando alguien
              compra a través de él, la comisión se acredita en tu monedero.
            </p>
            <Link
              href="/registro"
              className="mt-6 inline-block rounded-full bg-teal px-6 py-3 text-sm font-600 text-white transition hover:bg-tealDark"
            >
              Crear mi cuenta gratis
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
