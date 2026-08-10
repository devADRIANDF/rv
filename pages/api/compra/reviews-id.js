import { dbGet, dbRun } from "../../../lib/db";
import { getUserIdFromReq } from "../../../lib/auth";

const PRECIO_UNIDAD = 800;
const MINIMO = 5;

async function registrarComision(orderId, buyerId, amountCents) {
  const buyer = await dbGet("SELECT referred_by FROM users WHERE id = ?", [buyerId]);
  if (!buyer || !buyer.referred_by) return;
  const comision = Math.round(amountCents * 0.1);
  await dbRun(
    "INSERT INTO referral_earnings (affiliate_id, from_user_id, order_id, amount_cents) VALUES (?, ?, ?, ?)",
    [buyer.referred_by, buyerId, orderId, comision]
  );
  await dbRun("UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?", [comision, buyer.referred_by]);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const uid = getUserIdFromReq(req);
  if (!uid) return res.status(401).json({ error: "No autenticado." });

  const n = Number((req.body || {}).package);
  const targetId = ((req.body || {}).targetId || "").trim();
  if (!Number.isInteger(n) || n < MINIMO) {
    return res.status(400).json({ error: `El mínimo es ${MINIMO} reviews.` });
  }
  if (!targetId) return res.status(400).json({ error: "Indica el ID de tu cuenta." });

  const precio = n * PRECIO_UNIDAD;
  const user = await dbGet("SELECT wallet_balance FROM users WHERE id = ?", [uid]);
  if (user.wallet_balance < precio) {
    return res.status(400).json({ error: "Saldo insuficiente. Recarga tu monedero." });
  }

  await dbRun("UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?", [precio, uid]);
  const info = await dbRun(
    "INSERT INTO orders (user_id, type, package, target_id, amount_cents, status) VALUES (?, 'reviews_id', ?, ?, ?, 'pendiente')",
    [uid, n, targetId, precio]
  );
  await registrarComision(info.lastInsertRowid, uid, precio);

  res.status(201).json({ ok: true, orderId: info.lastInsertRowid });
}
