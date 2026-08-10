import { dbAll } from "../../../lib/db";
import { isAdminReq } from "../../../lib/adminAuth";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!isAdminReq(req)) {
    return res.status(401).json({ error: "No autorizado." });
  }

  try {
    const rows = await dbAll(
      `SELECT u.id, u.email, u.wallet_balance, u.referral_code, u.created_at,
              (SELECT COUNT(*)::int FROM users r WHERE r.referred_by = u.id) as referidos,
              (SELECT COALESCE(SUM(amount_cents),0)::int FROM referral_earnings re WHERE re.affiliate_id = u.id) as comisiones_cents
       FROM users u ORDER BY u.created_at DESC`
    );
    return res.status(200).json({ users: rows });
  } catch (error) {
    console.error("Error en admin/users:", error);
    return res.status(500).json({ error: "Error consultando usuarios." });
  }
}
