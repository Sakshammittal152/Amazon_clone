import nodemailer from 'nodemailer';

export async function sendOrderEmail(user, order) {
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_FROM;
  const smtpPass = (process.env.SMTP_PASS || process.env.EMAIL_PASSWORD || '').replace(/\s/g, '');
  const smtpHost = process.env.SMTP_HOST || (smtpUser ? 'smtp.gmail.com' : '');
  const hasSmtp = smtpHost && smtpUser && smtpPass;

  if (!hasSmtp) {
    console.log(`Order email skipped. Order ${order.orderNumber} placed for ${user.email}.`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM || `Amazon Clone <${smtpUser}>`,
    to: user.email,
    subject: `Order placed: ${order.orderNumber}`,
    html: `
      <h2>Thanks for your order, ${user.name}!</h2>
      <p>Your order <strong>${order.orderNumber}</strong> has been placed successfully.</p>
      <p>Total: <strong>Rs. ${Number(order.total).toFixed(2)}</strong></p>
    `
  });
}
