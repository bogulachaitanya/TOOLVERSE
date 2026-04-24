import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// In-memory OTP store (email -> { otp, expires })
const otpStore = new Map<string, { otp: string; expires: number }>();

// API Routes
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  otpStore.set(email, { otp, expires });

  console.log(`[OTP] Generated for ${email}: ${otp}`);

  if (resend) {
    try {
      await resend.emails.send({
        from: 'ToolVerse <onboarding@resend.dev>',
        to: email,
        subject: 'Your ToolVerse Login Code',
        html: `
          <div style="font-family: sans-serif; padding: 20px; background-color: #000; color: #fff; border-radius: 12px;">
            <h2 style="color: #00cfff;">ToolVerse Verification</h2>
            <p>Your security code is:</p>
            <h1 style="font-size: 40px; letter-spacing: 5px; color: #fff;">${otp}</h1>
            <p style="color: #666; font-size: 12px;">This code expires in 10 minutes.</p>
          </div>
        `
      });
      return res.json({ success: true, message: 'OTP sent to email' });
    } catch (error: any) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: 'Failed to send email. Check API key configuration.' });
    }
  } else {
    // Fallback for when API key is not set
    return res.json({ 
      success: true, 
      simulated: true, 
      message: 'Resend API key missing. OTP logged to server console for development.',
      debugOtp: otp // We include this in debug mode only if no key
    });
  }
});

app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const stored = otpStore.get(email);

  if (!stored) {
    return res.status(400).json({ error: 'No OTP requested for this email' });
  }

  if (Date.now() > stored.expires) {
    otpStore.delete(email);
    return res.status(400).json({ error: 'OTP expired' });
  }

  if (stored.otp === otp) {
    otpStore.delete(email); // One-time use
    return res.json({ success: true, message: 'OTP verified' });
  }

  return res.status(400).json({ error: 'Invalid OTP' });
});

async function setupVite() {
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }
}

// Start the server for local development or Railway
if (!process.env.VERCEL) {
  setupVite().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

export default app;
