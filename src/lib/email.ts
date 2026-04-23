import { Resend } from 'resend';
import type { Order } from '@/types/user';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = `${process.env.EMAIL_FROM_NAME ?? 'TechLaden.de'} <${process.env.EMAIL_FROM ?? 'noreply@techladen.de'}>`;
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://techladen.de';

// ─── Shared styles ────────────────────────────────────────────
const css = `
  body { margin:0; padding:0; background:#F8F9FA; font-family:'Helvetica Neue',Arial,sans-serif; color:#1A1A2E; }
  .wrap { max-width:600px; margin:0 auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.08); }
  .header { background:#E63946; padding:28px 32px; }
  .header h1 { margin:0; color:#fff; font-size:22px; font-weight:700; letter-spacing:-0.3px; }
  .header p { margin:4px 0 0; color:rgba(255,255,255,0.85); font-size:13px; }
  .body { padding:32px; }
  .section-title { font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:#6C757D; margin:0 0 12px; }
  .info-box { background:#F8F9FA; border-radius:8px; padding:16px 20px; margin-bottom:20px; }
  .info-row { display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #E9ECEF; font-size:14px; }
  .info-row:last-child { border-bottom:none; }
  .info-row .label { color:#6C757D; }
  .info-row .value { font-weight:600; color:#1A1A2E; }
  .product-row { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid #E9ECEF; }
  .product-row:last-child { border-bottom:none; }
  .product-img { width:48px; height:48px; border-radius:8px; object-fit:contain; background:#F8F9FA; border:1px solid #E9ECEF; }
  .product-name { font-size:13px; font-weight:500; color:#1A1A2E; flex:1; }
  .product-qty { font-size:12px; color:#6C757D; }
  .product-price { font-size:14px; font-weight:700; color:#1A1A2E; white-space:nowrap; }
  .total-row { display:flex; justify-content:space-between; padding:8px 0; font-size:14px; }
  .total-row.grand { border-top:2px solid #E9ECEF; margin-top:4px; padding-top:12px; font-size:16px; font-weight:700; }
  .total-row.grand .amount { color:#E63946; }
  .btn { display:inline-block; background:#E63946; color:#fff !important; text-decoration:none; padding:14px 32px; border-radius:8px; font-weight:700; font-size:15px; margin:20px 0; }
  .badge { display:inline-block; background:#d1fae5; color:#065f46; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:600; }
  .footer { background:#F8F9FA; padding:20px 32px; text-align:center; font-size:12px; color:#6C757D; border-top:1px solid #E9ECEF; }
  .footer a { color:#E63946; text-decoration:none; }
`;

function baseLayout(content: string, preheader = '') {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>${css}</style>
</head>
<body>
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>` : ''}
  <div style="padding:24px 16px;">
    <div class="wrap">
      ${content}
      <div class="footer">
        <p>© 2026 TechLaden.de · <a href="${BASE_URL}/impressum">Impressum</a> · <a href="${BASE_URL}/datenschutz">Datenschutz</a></p>
        <p style="margin-top:4px;">TechLaden.de — Premium Handy-Zubehör</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function itemsHtml(items: Order['items']) {
  return items.map(item => `
    <div class="product-row">
      ${item.image ? `<img src="${item.image}" alt="${item.title}" class="product-img" />` : ''}
      <div style="flex:1;min-width:0;">
        <div class="product-name">${item.title}</div>
        <div class="product-qty">
          ${item.selectedColor ? `Farbe: ${item.selectedColor}` : ''}
          ${item.selectedModel ? ` · Modell: ${item.selectedModel}` : ''}
          × ${item.quantity}
        </div>
      </div>
      <div class="product-price">${(item.price * item.quantity).toFixed(2).replace('.', ',')} €</div>
    </div>
  `).join('');
}

function totalsHtml(order: Order) {
  return `
    <div class="total-row">
      <span style="color:#6C757D;">Zwischensumme</span>
      <span>${order.subtotal.toFixed(2).replace('.', ',')} €</span>
    </div>
    <div class="total-row">
      <span style="color:#6C757D;">Versand</span>
      <span style="color:#2ECC71;font-weight:600;">${order.shipping === 0 ? 'Kostenlos' : order.shipping.toFixed(2).replace('.', ',') + ' €'}</span>
    </div>
    <div class="total-row grand">
      <span>Gesamt (inkl. 19% MwSt.)</span>
      <span class="amount">${order.total.toFixed(2).replace('.', ',')} €</span>
    </div>
  `;
}

// ─── Email 1: Zahlungsaufforderung (przed płatnością) ─────────
export async function sendPaymentRequestEmail(
  order: Order & { id: string },
  stripeUrl: string
) {
  const orderNum = order.id.slice(-8).toUpperCase();
  const html = baseLayout(`
    <div class="header">
      <h1>⚡ TechLaden.de</h1>
      <p>Deine Bestellung #${orderNum} wartet auf Zahlung</p>
    </div>
    <div class="body">
      <p style="font-size:16px;font-weight:600;margin:0 0 4px;">Hallo ${order.shippingAddress.firstName},</p>
      <p style="color:#6C757D;margin:0 0 24px;font-size:14px;">
        vielen Dank für deine Bestellung! Bitte schließe die Zahlung ab, um deine Bestellung zu bestätigen.
      </p>

      <p class="section-title">Bestellübersicht</p>
      <div class="info-box">
        ${itemsHtml(order.items)}
      </div>
      <div style="padding:0 4px;">
        ${totalsHtml(order)}
      </div>

      <div style="text-align:center;margin:28px 0;">
        <a href="${stripeUrl}" class="btn">💳 Jetzt bezahlen ${order.total.toFixed(2).replace('.', ',')} €</a>
        <p style="font-size:12px;color:#6C757D;margin:8px 0 0;">
          Der Zahlungslink ist 24 Stunden gültig.
        </p>
      </div>

      <p class="section-title">Lieferadresse</p>
      <div class="info-box">
        <div class="info-row"><span class="label">Name</span><span class="value">${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</span></div>
        <div class="info-row"><span class="label">Adresse</span><span class="value">${order.shippingAddress.street}</span></div>
        <div class="info-row"><span class="label">Stadt</span><span class="value">${order.shippingAddress.zip} ${order.shippingAddress.city}</span></div>
        <div class="info-row"><span class="label">Land</span><span class="value">${order.shippingAddress.country}</span></div>
      </div>
    </div>
  `, `Bestellung #${orderNum} — Zahlung ausstehend: ${order.total.toFixed(2).replace('.', ',')} €`);

  return resend.emails.send({
    from: FROM,
    to: order.shippingAddress.email,
    subject: `Bestellung #${orderNum} — Bitte bezahlen | TechLaden.de`,
    html,
  });
}

// ─── Email 2: Zahlungsbestätigung + Rechnung ──────────────────
export async function sendOrderConfirmationEmail(order: Order & { id: string }) {
  const orderNum = order.id.slice(-8).toUpperCase();
  const date = new Date(order.createdAt).toLocaleDateString('de-DE', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  const html = baseLayout(`
    <div class="header">
      <h1>⚡ TechLaden.de</h1>
      <p>Bestellbestätigung & Rechnung #${orderNum}</p>
    </div>
    <div class="body">
      <p style="font-size:16px;font-weight:600;margin:0 0 4px;">Hallo ${order.shippingAddress.firstName},</p>
      <p style="color:#6C757D;margin:0 0 8px;font-size:14px;">
        deine Zahlung wurde erfolgreich verarbeitet. Vielen Dank für deinen Einkauf!
      </p>
      <p style="margin:0 0 24px;">
        <span class="badge">✓ Bezahlt</span>
      </p>

      <p class="section-title">Rechnung</p>
      <div class="info-box">
        <div class="info-row"><span class="label">Rechnungsnummer</span><span class="value">TL-${orderNum}</span></div>
        <div class="info-row"><span class="label">Rechnungsdatum</span><span class="value">${date}</span></div>
        <div class="info-row"><span class="label">Bestellnummer</span><span class="value">#${orderNum}</span></div>
        <div class="info-row"><span class="label">Zahlungsmethode</span><span class="value">Kreditkarte (Stripe)</span></div>
      </div>

      <p class="section-title">Bestellte Artikel</p>
      <div class="info-box">
        ${itemsHtml(order.items)}
      </div>
      <div style="padding:0 4px;">
        ${totalsHtml(order)}
      </div>

      <p class="section-title" style="margin-top:24px;">Lieferadresse</p>
      <div class="info-box">
        <div class="info-row"><span class="label">Name</span><span class="value">${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</span></div>
        <div class="info-row"><span class="label">Adresse</span><span class="value">${order.shippingAddress.street}</span></div>
        <div class="info-row"><span class="label">Stadt</span><span class="value">${order.shippingAddress.zip} ${order.shippingAddress.city}</span></div>
        <div class="info-row"><span class="label">Land</span><span class="value">${order.shippingAddress.country}</span></div>
      </div>

      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:14px 18px;margin-top:20px;">
        <p style="margin:0;font-size:13px;color:#92400e;">
          🚚 <strong>Lieferzeit: 3–7 Werktage.</strong> Du erhältst eine separate E-Mail mit der Sendungsverfolgung, sobald dein Paket versendet wurde.
        </p>
      </div>

      <div style="text-align:center;margin-top:28px;">
        <a href="${BASE_URL}/mein-konto/bestellungen" class="btn" style="background:#1A1A2E;">Meine Bestellungen ansehen</a>
      </div>
    </div>
  `, `Zahlung bestätigt! Bestellung #${orderNum} — ${order.total.toFixed(2).replace('.', ',')} €`);

  return resend.emails.send({
    from: FROM,
    to: order.shippingAddress.email,
    subject: `✓ Bestellung #${orderNum} bestätigt — Rechnung | TechLaden.de`,
    html,
  });
}

// ─── Email 3: Versandbestätigung ──────────────────────────────
export async function sendShippingEmail(order: Order & { id: string }, trackingNumber?: string) {
  const orderNum = order.id.slice(-8).toUpperCase();

  const html = baseLayout(`
    <div class="header">
      <h1>⚡ TechLaden.de</h1>
      <p>Deine Bestellung #${orderNum} wurde versendet!</p>
    </div>
    <div class="body">
      <p style="font-size:16px;font-weight:600;margin:0 0 4px;">Hallo ${order.shippingAddress.firstName},</p>
      <p style="color:#6C757D;margin:0 0 24px;font-size:14px;">
        dein Paket ist auf dem Weg zu dir! 🎉
      </p>

      ${trackingNumber ? `
      <div class="info-box" style="text-align:center;">
        <p style="margin:0 0 4px;font-size:13px;color:#6C757D;">Sendungsverfolgungsnummer</p>
        <p style="margin:0;font-size:20px;font-weight:700;letter-spacing:2px;">${trackingNumber}</p>
      </div>
      ` : ''}

      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:14px 18px;margin-bottom:20px;">
        <p style="margin:0;font-size:13px;color:#1e40af;">
          📦 Geschätzte Lieferzeit: <strong>3–7 Werktage</strong>
        </p>
      </div>

      <p class="section-title">Deine Bestellung</p>
      <div class="info-box">
        ${itemsHtml(order.items)}
      </div>

      <p class="section-title">Lieferadresse</p>
      <div class="info-box">
        <div class="info-row"><span class="label">Name</span><span class="value">${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</span></div>
        <div class="info-row"><span class="label">Adresse</span><span class="value">${order.shippingAddress.street}, ${order.shippingAddress.zip} ${order.shippingAddress.city}</span></div>
      </div>
    </div>
  `, `Dein Paket ist unterwegs! Bestellung #${orderNum}`);

  return resend.emails.send({
    from: FROM,
    to: order.shippingAddress.email,
    subject: `🚚 Bestellung #${orderNum} wurde versendet | TechLaden.de`,
    html,
  });
}
