const LOGO_URL = 'https://www.southerngassolutions.com/static/media/Southern-Gas-Solutions.ba65e9ccfa6507301b29.svg';
const ICON_URL = 'https://www.southerngassolutions.com/Southern-Gas-Solutions-Icon.svg';

function buildEmail({ title, heading, fields }) {
  const rows = fields
    .filter(([, value]) => value)
    .map(([label, value]) => `
      <tr>
        <td style="padding:10px 14px;font-weight:600;color:#1a3a5c;border-bottom:1px solid #eef1f5;width:160px;font-family:'Montserrat',Arial,sans-serif;font-size:14px;">${label}</td>
        <td style="padding:10px 14px;color:#3a4a5c;border-bottom:1px solid #eef1f5;font-family:'Open Sans',Arial,sans-serif;font-size:14px;">${value}</td>
      </tr>`)
    .join('');

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Open Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

        <tr>
          <td style="background:#e8ecf1;padding:28px 32px;text-align:center;">
            <img src="${LOGO_URL}" alt="Southern Gas Solutions" width="260" style="display:block;margin:0 auto;" />
          </td>
        </tr>

        <tr>
          <td style="height:4px;background:linear-gradient(90deg,#e86a10,#f0a830);"></td>
        </tr>

        <tr>
          <td style="padding:28px 32px 8px;">
            <h1 style="margin:0;font-family:'Montserrat',Arial,sans-serif;font-size:22px;font-weight:800;color:#0a1628;">${heading}</h1>
            <p style="margin:8px 0 0;font-size:14px;color:#6b7a8d;">${title}</p>
          </td>
        </tr>

        <tr>
          <td style="padding:16px 32px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eef1f5;border-radius:6px;overflow:hidden;">
              ${rows}
            </table>
          </td>
        </tr>

        <tr>
          <td style="background:#0a1628;padding:24px 32px;text-align:center;">
            <img src="${ICON_URL}" alt="SGS" width="36" style="display:block;margin:0 auto 10px;" />
            <p style="margin:0;font-family:'Montserrat',Arial,sans-serif;font-size:12px;color:rgba(255,255,255,0.6);">
              Southern Gas Solutions &bull; Serving North Georgia &amp; Metro Atlanta
            </p>
            <p style="margin:6px 0 0;font-size:11px;color:rgba(255,255,255,0.4);">
              This is an automated notification from your website.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildConfirmationEmail({ name, type, details }) {
  const detailRows = details
    ? details
        .filter(([, value]) => value)
        .map(([label, value]) => `
          <tr>
            <td style="padding:8px 14px;font-weight:600;color:#1a3a5c;border-bottom:1px solid #eef1f5;width:140px;font-family:'Montserrat',Arial,sans-serif;font-size:13px;">${label}</td>
            <td style="padding:8px 14px;color:#3a4a5c;border-bottom:1px solid #eef1f5;font-family:'Open Sans',Arial,sans-serif;font-size:13px;">${value}</td>
          </tr>`)
        .join('')
    : '';

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Open Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

        <tr>
          <td style="background:#e8ecf1;padding:28px 32px;text-align:center;">
            <img src="${LOGO_URL}" alt="Southern Gas Solutions" width="260" style="display:block;margin:0 auto;" />
          </td>
        </tr>

        <tr>
          <td style="height:4px;background:linear-gradient(90deg,#e86a10,#f0a830);"></td>
        </tr>

        <tr>
          <td style="padding:32px 32px 12px;">
            <h1 style="margin:0;font-family:'Montserrat',Arial,sans-serif;font-size:22px;font-weight:800;color:#0a1628;">Thank you, ${name}!</h1>
            <p style="margin:12px 0 0;font-size:15px;color:#3a4a5c;line-height:1.6;">
              We've received your ${type} and our team will review it shortly. You can expect to hear back from us within <strong>1–2 business days</strong>.
            </p>
          </td>
        </tr>

        ${detailRows ? `
        <tr>
          <td style="padding:8px 32px 4px;">
            <p style="margin:0;font-family:'Montserrat',Arial,sans-serif;font-size:13px;font-weight:700;color:#6b7a8d;text-transform:uppercase;letter-spacing:0.5px;">What you submitted</p>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 32px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eef1f5;border-radius:6px;overflow:hidden;">
              ${detailRows}
            </table>
          </td>
        </tr>` : ''}

        <tr>
          <td style="padding:0 32px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef7f0;border-radius:6px;border:1px solid #fde8d0;">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="margin:0;font-size:14px;color:#3a4a5c;line-height:1.6;">
                    <strong style="color:#e86a10;">Need immediate help?</strong><br/>
                    Call us at <a href="tel:4048623911" style="color:#e86a10;font-weight:600;">(404) 862-3911</a> — available 24/7 for emergencies.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="background:#0a1628;padding:24px 32px;text-align:center;">
            <img src="${ICON_URL}" alt="SGS" width="36" style="display:block;margin:0 auto 10px;" />
            <p style="margin:0;font-family:'Montserrat',Arial,sans-serif;font-size:12px;color:rgba(255,255,255,0.6);">
              Southern Gas Solutions &bull; Serving North Georgia &amp; Metro Atlanta
            </p>
            <p style="margin:6px 0 0;font-size:11px;color:rgba(255,255,255,0.4);">
              Please do not reply to this email. Contact us at <a href="mailto:devon@southerngassolutions.com" style="color:#e86a10;">devon@southerngassolutions.com</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildQuoteEmail({ name, quote, approveUrl }) {
  const money = (n) => `$${(Number(n) || 0).toFixed(2)}`;
  const lineRows = (quote.rows || []).map(r => {
    const lineTotal = (Number(r.qty) || 0) * (Number(r.unitPrice) || 0);
    return `<tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eef1f5;font-size:13px;color:#3a4a5c;">${r.item || ''}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eef1f5;font-size:13px;color:#3a4a5c;">${r.description || ''}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eef1f5;font-size:13px;color:#3a4a5c;text-align:center;">${r.qty}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eef1f5;font-size:13px;color:#3a4a5c;text-align:right;">${money(r.unitPrice)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eef1f5;font-size:13px;color:#0a1628;font-weight:600;text-align:right;">${money(lineTotal)}</td>
    </tr>`;
  }).join('');

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Open Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

        <tr><td style="background:#e8ecf1;padding:28px 32px;text-align:center;"><img src="${LOGO_URL}" alt="Southern Gas Solutions" width="260" style="display:block;margin:0 auto;" /></td></tr>
        <tr><td style="height:4px;background:linear-gradient(90deg,#e86a10,#f0a830);"></td></tr>

        <tr><td style="padding:28px 32px 12px;">
          <h1 style="margin:0;font-family:'Montserrat',Arial,sans-serif;font-size:22px;font-weight:800;color:#0a1628;">Hi ${name}, here's your quote!</h1>
          <p style="margin:10px 0 0;font-size:14px;color:#6b7a8d;">Please review the details below. A PDF copy is also attached.</p>
        </td></tr>

        <tr><td style="padding:8px 32px 4px;"><p style="margin:0;font-family:'Montserrat',Arial,sans-serif;font-size:12px;font-weight:700;color:#6b7a8d;text-transform:uppercase;letter-spacing:0.5px;">Line Items</p></td></tr>
        <tr><td style="padding:8px 32px 16px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eef1f5;border-radius:6px;overflow:hidden;">
            <tr style="background:#0a1628;">
              <td style="padding:8px 12px;font-size:11px;font-weight:700;color:#fff;">ITEM</td>
              <td style="padding:8px 12px;font-size:11px;font-weight:700;color:#fff;">DESCRIPTION</td>
              <td style="padding:8px 12px;font-size:11px;font-weight:700;color:#fff;text-align:center;">QTY</td>
              <td style="padding:8px 12px;font-size:11px;font-weight:700;color:#fff;text-align:right;">PRICE</td>
              <td style="padding:8px 12px;font-size:11px;font-weight:700;color:#fff;text-align:right;">TOTAL</td>
            </tr>
            ${lineRows}
          </table>
        </td></tr>

        <tr><td style="padding:0 32px 20px;">
          <table width="260" cellpadding="0" cellspacing="0" align="right" style="border:1px solid #eef1f5;border-radius:6px;overflow:hidden;">
            <tr><td style="padding:8px 14px;font-size:13px;color:#6b7a8d;">Subtotal</td><td style="padding:8px 14px;font-size:13px;color:#3a4a5c;text-align:right;">${money(quote.subtotal)}</td></tr>
            <tr><td style="padding:8px 14px;font-size:13px;color:#6b7a8d;">Tax</td><td style="padding:8px 14px;font-size:13px;color:#3a4a5c;text-align:right;">${money(quote.taxDue)}</td></tr>
            <tr style="background:#0a1628;"><td style="padding:10px 14px;font-size:14px;font-weight:700;color:#fff;">TOTAL</td><td style="padding:10px 14px;font-size:14px;font-weight:700;color:#e86a10;text-align:right;">${money(quote.total)}</td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:16px 32px 28px;text-align:center;">
          <a href="${approveUrl}" style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#e86a10,#d4451a);color:#ffffff;font-family:'Montserrat',Arial,sans-serif;font-weight:700;font-size:15px;border-radius:6px;text-decoration:none;">✅ Approve Quote & Schedule</a>
          <p style="margin:12px 0 0;font-size:12px;color:#6b7a8d;">Click above to approve this quote and pick your preferred date(s).</p>
        </td></tr>

        <tr><td style="padding:0 32px 28px;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#fef7f0;border-radius:6px;border:1px solid #fde8d0;"><tr><td style="padding:16px 20px;"><p style="margin:0;font-size:14px;color:#3a4a5c;line-height:1.6;"><strong style="color:#e86a10;">Questions?</strong><br/>Call us at <a href="tel:4048623911" style="color:#e86a10;font-weight:600;">(404) 862-3911</a> or email <a href="mailto:devon@southerngassolutions.com" style="color:#e86a10;">devon@southerngassolutions.com</a></p></td></tr></table></td></tr>

        <tr><td style="background:#0a1628;padding:24px 32px;text-align:center;"><img src="${ICON_URL}" alt="SGS" width="36" style="display:block;margin:0 auto 10px;" /><p style="margin:0;font-family:'Montserrat',Arial,sans-serif;font-size:12px;color:rgba(255,255,255,0.6);">Southern Gas Solutions &bull; Serving North Georgia &amp; Metro Atlanta</p></td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

module.exports = { buildEmail, buildConfirmationEmail, buildQuoteEmail };
