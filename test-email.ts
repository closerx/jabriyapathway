import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
resend.emails.send({
  from: 'System <onboarding@resend.dev>',
  to: ["test12345@gmail.com"],
  subject: 'Test',
  html: '<p>Test</p>'
}).then(r => console.log(JSON.stringify(r))).catch(e => console.log(e));
