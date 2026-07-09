import nodemailer from 'nodemailer'

export function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })
}

const PAYMENT_LABELS: Record<string, string> = {
  cash: 'Cash',
  transfer: 'Bank Transfer',
  edinar: 'E-Dinar',
}

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function buildOwnerNotificationHtml(r: {
  id: string
  name: string
  phone: string
  email: string
  serviceLabel: string
  date: string
  time: string
  people: number
  hours: number
  message: string
  payment: string
  total: number
}) {
  const rows = [
    ['Reservation ID', r.id],
    ['Customer', r.name],
    ['Email', r.email],
    ['Phone', r.phone],
    ['Service', r.serviceLabel],
    ['Date', r.date],
    ['Time', r.time],
    ['Guests', String(r.people)],
    ...(r.hours > 1 ? [['Duration', `${r.hours} hours`]] : []),
    ['Payment', PAYMENT_LABELS[r.payment] ?? r.payment],
    ['Total', `${r.total} DT`],
  ]

  const messageBlock = r.message
    ? `<tr>
         <td style="background:#fff;padding:0 40px 32px;">
           <table width="100%" cellpadding="0" cellspacing="0"
             style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:20px;">
             <tr><td>
               <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:3px;text-transform:uppercase;">
                 Customer Message
               </p>
               <p style="margin:0;color:#334155;font-size:14px;line-height:1.7;">${escapeHtml(r.message)}</p>
             </td></tr>
           </table>
         </td>
       </tr>`
    : ''

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>New Reservation – AQUA RIDE</title>
</head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <tr>
          <td style="background:linear-gradient(135deg,#062B37 0%,#0a3d4f 100%);border-radius:24px 24px 0 0;padding:36px 40px 28px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:30px;font-weight:900;letter-spacing:3px;">AQUA <span style="color:#06b6d4;">RIDE</span></h1>
            <p style="margin:10px 0 0;color:#06b6d4;font-size:15px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
              New Reservation Received
            </p>
          </td>
        </tr>

        <tr>
          <td style="background:#fff;padding:32px 40px 8px;text-align:center;">
            <div style="display:inline-block;background:#ecfeff;border:2px solid #67e8f9;border-radius:50%;width:64px;height:64px;line-height:64px;font-size:32px;">🔔</div>
            <h2 style="margin:18px 0 6px;color:#062B37;font-size:24px;font-weight:900;">You have a new booking</h2>
            <p style="margin:0;color:#64748b;font-size:15px;">A new reservation was just made on your site.</p>
          </td>
        </tr>

        <tr>
          <td style="background:#fff;padding:16px 40px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:#f8fafc;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
              ${rows.map(([label, value]) => `
              <tr>
                <td style="padding:14px 24px;border-bottom:1px solid #f1f5f9;">
                  <table width="100%" cellpadding="0" cellspacing="0"><tr>
                    <td style="color:#64748b;font-size:14px;">${label}</td>
                    <td style="color:#0f172a;font-size:14px;font-weight:700;text-align:right;">${escapeHtml(value)}</td>
                  </tr></table>
                </td>
              </tr>`).join('')}
            </table>
          </td>
        </tr>

        ${messageBlock}

        <tr>
          <td style="background:#062B37;border-radius:0 0 24px 24px;padding:28px 40px;text-align:center;">
            <p style="margin:0;color:#fff;font-size:16px;font-weight:900;">AQUA <span style="color:#06b6d4;">RIDE</span></p>
            <p style="margin:4px 0 0;color:rgba(255,255,255,.4);font-size:12px;">Luxury Sea Experiences · Tunisia</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
`
}

const CONFIRM_PAYMENT_LABELS: Record<string, string> = {
  cash: 'Cash',
  transfer: 'Bank Transfer',
  edinar: 'E-Dinar',
}

export function buildConfirmationHtml(data: {
  name: string
  email: string
  serviceLabel: string
  date: string
  time: string
  people: number
  hours: number
  payment: string
  total: number
  discount: number
  id: string
  adminNote?: string
}) {
  const discountedTotal = Math.round(data.total * (1 - data.discount / 100))

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Booking Confirmed – AQUA RIDE</title>
</head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#062B37 0%,#0a3d4f 100%);border-radius:24px 24px 0 0;padding:40px 40px 32px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:32px;font-weight:900;letter-spacing:3px;">AQUA <span style="color:#06b6d4;">RIDE</span></h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,.6);font-size:13px;letter-spacing:4px;text-transform:uppercase;">
              Luxury Sea Experiences · Tunisia
            </p>
          </td>
        </tr>

        <!-- Success -->
        <tr>
          <td style="background:#fff;padding:40px 40px 32px;text-align:center;">
            <div style="display:inline-block;background:#ecfdf5;border:2px solid #6ee7b7;border-radius:50%;width:72px;height:72px;line-height:72px;font-size:36px;">✓</div>
            <h2 style="margin:20px 0 8px;color:#062B37;font-size:28px;font-weight:900;">Booking Confirmed!</h2>
            <p style="margin:0;color:#64748b;font-size:16px;">
              Hi <strong style="color:#06b6d4;">${data.name}</strong>, your reservation is all set.<br/>
              We look forward to welcoming you aboard.
            </p>
          </td>
        </tr>

        <!-- Details table -->
        <tr>
          <td style="background:#fff;padding:0 40px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:#f8fafc;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
              <tr>
                <td style="padding:20px 24px;border-bottom:1px solid #e2e8f0;">
                  <p style="margin:0;font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:3px;text-transform:uppercase;">
                    Reservation Details
                  </p>
                </td>
              </tr>
              ${[
                ['Reservation ID', data.id],
                ['Service',        data.serviceLabel],
                ['Date',           data.date],
                ['Time',           data.time],
                ['Guests',         String(data.people)],
                ...(data.hours > 1 ? [['Duration', `${data.hours} hours`]] : []),
                ['Payment',        CONFIRM_PAYMENT_LABELS[data.payment] ?? data.payment],
              ].map(([label, value]) => `
              <tr>
                <td style="padding:14px 24px;border-bottom:1px solid #f1f5f9;">
                  <table width="100%" cellpadding="0" cellspacing="0"><tr>
                    <td style="color:#64748b;font-size:14px;">${label}</td>
                    <td style="color:#0f172a;font-size:14px;font-weight:700;text-align:right;">${value}</td>
                  </tr></table>
                </td>
              </tr>`).join('')}

              <!-- Total row -->
              <tr>
                <td style="padding:20px 24px;background:#062B37;border-radius:0 0 16px 16px;">
                  <table width="100%" cellpadding="0" cellspacing="0"><tr>
                    <td style="color:rgba(255,255,255,.7);font-size:14px;">Total Amount</td>
                    <td style="text-align:right;">
                      ${data.discount > 0
                        ? `<span style="color:rgba(255,255,255,.4);font-size:13px;text-decoration:line-through;margin-right:8px;">${data.total} DT</span>`
                        : ''}
                      <span style="color:#06b6d4;font-size:26px;font-weight:900;">${discountedTotal} DT</span>
                      ${data.discount > 0
                        ? `<span style="background:#06b6d4;color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px;margin-left:6px;">-${data.discount}%</span>`
                        : ''}
                    </td>
                  </tr></table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- What's next -->
        <tr>
          <td style="background:#fff;padding:0 40px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:linear-gradient(135deg,rgba(6,182,212,.08),rgba(8,145,178,.08));border:1px solid rgba(6,182,212,.2);border-radius:16px;padding:24px;">
              <tr><td>
                <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#0891b2;letter-spacing:2px;text-transform:uppercase;">
                  What happens next?
                </p>
                <p style="margin:0;color:#334155;font-size:14px;line-height:1.7;">
                  Our team will contact you shortly to finalise the details of your experience.
                  If you have any questions, reply to this email or call us directly.
                </p>
              </td></tr>
            </table>
          </td>
        </tr>

        <!-- Message from AQUA RIDE team (only shown if admin wrote one) -->
        ${data.adminNote ? `
        <tr>
          <td style="background:#fff;padding:0 40px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:linear-gradient(135deg,#062B37,#0a3d4f);border-radius:16px;padding:28px;">
              <tr><td>
                <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:rgba(255,255,255,.5);letter-spacing:3px;text-transform:uppercase;">
                  Message from AQUA RIDE
                </p>
                <p style="margin:0;color:#ffffff;font-size:15px;line-height:1.8;">
                  ${data.adminNote}
                </p>
              </td></tr>
            </table>
          </td>
        </tr>` : ''}

        <!-- Footer -->
        <tr>
          <td style="background:#062B37;border-radius:0 0 24px 24px;padding:32px 40px;text-align:center;">
            <p style="margin:0 0 4px;color:#fff;font-size:18px;font-weight:900;">
              AQUA <span style="color:#06b6d4;">RIDE</span>
            </p>
            <p style="margin:0;color:rgba(255,255,255,.4);font-size:12px;">
              Luxury Sea Experiences · Tunisia
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
`
}

export async function sendCustomerConfirmation(reservation: {
  id: string
  name: string
  email: string
  serviceLabel: string
  date: string
  time: string
  people: number
  hours: number
  payment: string
  total: number
  discount: number
  adminNote?: string
}) {
  if (!reservation.email) {
    console.warn('No customer email – skipping confirmation')
    return
  }

  const transporter = createTransporter()
  await transporter.sendMail({
    from: `"AQUA RIDE" <${process.env.GMAIL_USER}>`,
    to: reservation.email,
    subject: `✅ Booking Confirmed – ${reservation.serviceLabel} on ${reservation.date}`,
    html: buildConfirmationHtml(reservation),
  })
}

export async function sendOwnerNotification(reservation: {
  id: string
  name: string
  phone: string
  email: string
  serviceLabel: string
  date: string
  time: string
  people: number
  hours: number
  message: string
  payment: string
  total: number
}) {
  const ownerEmail = process.env.GMAIL_USER
  if (!ownerEmail) {
    console.warn('GMAIL_USER not set – skipping owner notification')
    return
  }

  const transporter = createTransporter()
  await transporter.sendMail({
    from: `"AQUA RIDE" <${ownerEmail}>`,
    to: ownerEmail,
    replyTo: reservation.email,
    subject: `🔔 New Reservation – ${reservation.serviceLabel} on ${reservation.date}`,
    html: buildOwnerNotificationHtml(reservation),
  })
}

export async function sendOwnerConfirmationCopy(reservation: {
  id: string
  name: string
  email: string
  serviceLabel: string
  date: string
  time: string
  people: number
  hours: number
  payment: string
  total: number
  discount: number
}) {
  const ownerEmail = process.env.GMAIL_USER
  if (!ownerEmail) return

  const discountedTotal = Math.round(reservation.total * (1 - reservation.discount / 100))

  const transporter = createTransporter()
  await transporter.sendMail({
    from: `"AQUA RIDE" <${ownerEmail}>`,
    to: ownerEmail,
    replyTo: reservation.email,
    subject: `✅ Confirmed: ${reservation.serviceLabel} for ${reservation.name} – ${reservation.date}`,
    html: `
<!DOCTYPE html>
<html lang="en"><body style="margin:0;padding:0;background:#f0f4f8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr><td style="background:linear-gradient(135deg,#062B37,#0a3d4f);border-radius:20px 20px 0 0;padding:28px 32px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:26px;font-weight:900;letter-spacing:2px;">AQUA <span style="color:#06b6d4;">RIDE</span></h1>
        </td></tr>
        <tr><td style="background:#fff;padding:28px 32px;">
          <p style="margin:0 0 12px;color:#062B37;font-size:18px;font-weight:900;">Reservation confirmed ✅</p>
          <p style="margin:0 0 18px;color:#475569;font-size:14px;line-height:1.7;">
            You confirmed <strong>${reservation.name}</strong>'s booking. A confirmation email was sent to
            <strong>${reservation.email}</strong>.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;">
            ${[
              ['Reservation ID', reservation.id],
              ['Service', reservation.serviceLabel],
              ['Date', reservation.date],
              ['Time', reservation.time],
              ['Guests', String(reservation.people)],
              ...(reservation.hours > 1 ? [['Duration', `${reservation.hours} hours`]] : []),
              ['Total', `${discountedTotal} DT`],
              ['Customer email', reservation.email],
            ].map(([l, v]) => `
              <tr><td style="padding:12px 20px;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px;">${l}</td>
              <td style="padding:12px 20px;border-bottom:1px solid #f1f5f9;color:#0f172a;font-size:13px;font-weight:700;text-align:right;">${v}</td></tr>`).join('')}
          </table>
        </td></tr>
        <tr><td style="background:#062B37;border-radius:0 0 20px 20px;padding:22px 32px;text-align:center;">
          <p style="margin:0;color:rgba(255,255,255,.5);font-size:12px;">Luxury Sea Experiences · Tunisia</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>
`,
  })
}
