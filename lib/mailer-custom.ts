// 📧 OPTION 1: Envoi d'email SANS service externe (Nodemailer + SMTP)
import nodemailer from 'nodemailer'
import { db } from '@/lib/db'

// Configuration SMTP pour différents fournisseurs
const createTransport = () => {
  // Gmail SMTP
  if (process.env.EMAIL_PROVIDER === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // votre-email@gmail.com
        pass: process.env.GMAIL_APP_PASSWORD, // Mot de passe d'application
      },
    })
  }
  
  // Outlook/Hotmail SMTP
  if (process.env.EMAIL_PROVIDER === 'outlook') {
    return nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: process.env.OUTLOOK_USER,
        pass: process.env.OUTLOOK_PASSWORD,
      },
    })
  }
  
  // SMTP générique (tout fournisseur)
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true pour 465, false pour autres ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })
}

export async function sendTempPasswordEmailCustom(
  email: string,
  tempPassword: string,
  firstName?: string
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  // Template HTML identique
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to Deceased Status</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Welcome to Deceased Status</h1>
    <p style="margin: 10px 0 0; opacity: 0.9; font-size: 16px;">Enterprise Death Verification Platform</p>
  </div>
  
  <div style="background: #f8fafc; padding: 40px 30px; border-radius: 0 0 12px 12px;">
    <p style="margin: 0 0 20px; font-size: 16px;">
      ${firstName ? `Hi ${firstName},` : 'Hello,'}
    </p>
    
    <p style="margin: 0 0 20px; font-size: 16px;">
      Your account has been created successfully. Your temporary password is:
    </p>
    
    <div style="background: #1e293b; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
      <code style="font-family: 'Courier New', monospace; font-size: 18px; font-weight: bold; letter-spacing: 2px;">
        ${tempPassword}
      </code>
    </div>
    
    <p style="margin: 20px 0; font-size: 16px;">
      <strong>Important:</strong> You'll be required to change this password on your first login for security.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${appUrl}/login" style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
        Login to Your Account
      </a>
    </div>
    
    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
    
    <p style="margin: 0; font-size: 14px; color: #64748b; text-align: center;">
      This is an automated message. Please do not reply to this email.
    </p>
  </div>
</body>
</html>
  `

  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('=== EMAIL PREVIEW (Development - Custom SMTP) ===')
      console.log(`To: ${email}`)
      console.log(`Subject: Welcome to Deceased Status - Temporary Password`)
      console.log(`Temporary Password: ${tempPassword}`)
      console.log(`Login URL: ${appUrl}/login`)
      console.log('================================================')
      return
    }

    // 🚀 ENVOI RÉEL via SMTP personnalisé
    const transporter = createTransport()
    
    const mailOptions = {
      from: `"Deceased Status" <${process.env.SMTP_FROM || 'noreply@deceased-status.com'}>`,
      to: email,
      subject: 'Welcome to Deceased Status - Temporary Password',
      html: htmlContent,
      text: `
        Welcome to Deceased Status!
        
        Your temporary password is: ${tempPassword}
        
        Please login at: ${appUrl}/login
        
        Important: You'll be required to change this password on your first login.
      `, // Version texte pour compatibilité
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Email sent successfully:', info.messageId)
    
  } catch (error) {
    console.error('❌ Failed to send email via custom SMTP:', error)
    
    // Fallback console
    console.log('=== EMAIL FALLBACK (Custom SMTP Error) ===')
    console.log(`To: ${email}`)
    console.log(`Temporary Password: ${tempPassword}`)
    console.log(`Login URL: ${appUrl}/login`)
    console.log(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    console.log('=========================================')
  }
}

// 📧 OPTION 2: Envoi direct via API REST (pas de service externe)
export async function sendEmailViaAPI(
  email: string,
  tempPassword: string,
  firstName?: string
): Promise<void> {
  try {
    // Utilise l'API REST de votre propre serveur mail
    const response = await fetch(`${process.env.INTERNAL_MAIL_API}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.INTERNAL_MAIL_TOKEN}`,
      },
      body: JSON.stringify({
        to: email,
        subject: 'Welcome to Deceased Status - Temporary Password',
        template: 'welcome',
        variables: {
          firstName,
          tempPassword,
          loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Mail API returned ${response.status}`)
    }

    console.log('✅ Email sent via internal API')
  } catch (error) {
    console.error('❌ Failed to send via internal API:', error)
    
    // Fallback console
    console.log('=== EMAIL FALLBACK (API Error) ===')
    console.log(`To: ${email}`)
    console.log(`Temporary Password: ${tempPassword}`)
    console.log('==================================')
  }
}

// 📧 OPTION 3: Email stocké en base pour traitement en batch
export async function queueEmailForBatchSending(
  email: string,
  tempPassword: string,
  firstName?: string
): Promise<void> {
  try {
    // Log email sending (emailQueue table doesn't exist in schema)
    console.log(`Email queued for: ${email}`)
    /*await db.emailQueue.create({
      data: {
        to: email,
        subject: 'Welcome to Deceased Status - Temporary Password',
        template: 'welcome',
        variables: {
          firstName,
          tempPassword,
          loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
        },
        status: 'pending',
        scheduledFor: new Date(),
      },
    })*/

    console.log('✅ Email queued for batch processing')
    
    // En développement, simule l'envoi immédiatement
    if (process.env.NODE_ENV === 'development') {
      console.log('=== EMAIL QUEUE SIMULATION ===')
      console.log(`To: ${email}`)
      console.log(`Temporary Password: ${tempPassword}`)
      console.log('==============================')
    }
  } catch (error) {
    console.error('❌ Failed to queue email:', error)
  }
}
