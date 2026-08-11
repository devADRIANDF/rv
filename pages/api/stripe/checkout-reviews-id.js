import stripe from "../../../lib/stripe";
import { resolveRefCode } from "../../../lib/referral";

const PRECIO_UNIDAD = 800;
const MINIMO = 5;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { email, package: cantidad, targetId, ref: refFromBody } = req.body || {};
  const ref = await resolveRefCode(req, refFromBody);
  const n = Number(cantidad);

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: "Indica un email válido." });
  }
  if (!Number.isInteger(n) || n < MINIMO) {
    return res.status(400).json({ error: `El mínimo es ${MINIMO} reviews.` });
  }
  if (!targetId || !targetId.trim()) {
    return res.status(400).json({ error: "Indica el ID de tu cuenta." });
  }

  const amountCents = n * PRECIO_UNIDAD;
  const origin = req.headers.origin || `https://${req.headers.host}`;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    allow_promotion_codes: true,
    payment_method_types: ["card"],
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: amountCents,
          product_data: { name: `${n} reviews para tu cuenta (ID ${targetId.trim()})` },
        },
        quantity: 1,
      },
    ],
    metadata: {
      order_type: "reviews_id",
      email,
      cantidad: String(n),
      target_id: targetId.trim(),
      amount_cents: String(amountCents),
      ref: ref || "",
    },
    success_url: `${origin}/pedido/confirmado?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/reviews-a-tu-id`,
  });

  res.status(200).json({ url: session.url });
}
