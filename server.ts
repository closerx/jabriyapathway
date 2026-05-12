import express from "express";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- OTP Verification System ---
  const otpStore = new Map<string, { code: string, expiresAt: number }>();

  // 1. Send OTP Endpoint
  app.post("/api/sendOTP", async (req, res) => {
    console.log("Received request for sendOTP:", req.body);
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Missing email" });
      }

      // Generate a 6-digit random code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store in memory (Simulating Firestore for better security without Admin SDK)
      // Expiration time: 10 minutes
      otpStore.set(email, { 
        code: code, 
        expiresAt: Date.now() + 10 * 60 * 1000 
      });

      console.log("Sending OTP email to:", email);
      
      const htmlContent = `
        <div dir="rtl" style="font-family: sans-serif; text-align: right; padding: 20px;">
          <h2>مرحباً بك في نظام متابعة المرضى،</h2>
          <p>رمز التحقق الخاص بك هو: <strong style="font-size: 24px;">${code}</strong></p>
          <p>هذا الرمز صالح لمدة 10 دقائق.</p>
        </div>
      `;

      if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
        // Send using Nodemailer with Gmail App Password
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
          }
        });

        await transporter.sendMail({
          from: `"Verification" <${process.env.GMAIL_USER}>`,
          to: email,
          subject: 'رمز التحقق الخاص بك',
          html: htmlContent
        });
        
        console.log("Email sent successfully via Gmail API");
        return res.json({ success: true, message: "Email sent via SMTP" });
      } else {
        // Fallback for development: Mock the email sending
        console.log("--------------------------------------------------");
        console.log("MOCK EMAIL SENT (No GMAIL credentials in .env)");
        console.log(`To: ${email}`);
        console.log(`Code: ${code}`);
        console.log("--------------------------------------------------");
        return res.json({ 
          success: true, 
          code: code,
          message: "تم إرسال البريد وهمياً لعدم وجود GMAIL_USER/PASS. يرجى مراجعة نافذة Terminal (Console) لرؤية الرمز." 
        });
      }
    } catch (e) {
      console.error("Server exception while sending OTP:", e);
      res.status(500).json({ error: String(e) });
    }
  });

  // 2. Verify OTP Endpoint
  app.post("/api/verifyOTP", (req, res) => {
    try {
      const { email, code } = req.body;
      if (!email || !code) {
        return res.status(400).json({ success: false, error: "Missing email or code" });
      }

      const stored = otpStore.get(email);
      
      if (!stored) {
        return res.status(400).json({ success: false, error: "الكود غير موجود أو منتهي الصلاحية. يرجى طلب كود جديد." });
      }

      if (Date.now() > stored.expiresAt) {
        otpStore.delete(email); // Clean up
        return res.status(400).json({ success: false, error: "الكود منتهي الصلاحية." });
      }

      if (stored.code === code) {
        // Correct code! Delete from store and approve
        otpStore.delete(email);
        return res.json({ success: true, message: "تم التحقق بشكل صحيح." });
      } else {
        return res.status(400).json({ success: false, error: "الكود غير صحيح." });
      }
    } catch (e) {
      console.error("Server exception while verifying OTP:", e);
      res.status(500).json({ success: false, error: String(e) });
    }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
