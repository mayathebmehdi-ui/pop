// 🎯 VERSION COMPLÈTE : Tous les modes d'envoi d'email disponibles
import { sendTempPasswordEmailCustom } from './mailer-custom'
import { sendEmailNativeSMTP, sendEmailSimulated } from './mailer-native'

// Type pour choisir le mode d'envoi
type EmailProvider = 'resend' | 'smtp' | 'native' | 'simulated' | 'console'

// Configuration centralisée
interface EmailConfig {
  provider: EmailProvider
  smtpConfig?: {
    host: string
    port: number
    user: string
    password: string
    from: string
  }
}

// Fonction principale d'envoi (choisit automatiquement la méthode)
export async function sendTempPasswordEmail(
  email: string,
  tempPassword: string,
  firstName?: string
): Promise<void> {
  // Détermine le provider selon l'environnement
  const emailProvider: EmailProvider = (process.env.EMAIL_PROVIDER as EmailProvider) || getDefaultProvider()
  
  console.log(`📧 Using email provider: ${emailProvider}`)
  
  switch (emailProvider) {
    case 'resend':
      await sendViaResend(email, tempPassword, firstName)
      break
      
    case 'smtp':
      await sendTempPasswordEmailCustom(email, tempPassword, firstName)
      break
      
    case 'native':
      await sendEmailNativeSMTP(email, tempPassword, firstName)
      break
      
    case 'simulated':
      await sendEmailSimulated(email, tempPassword, firstName)
      break
      
    case 'console':
    default:
      await sendViaConsole(email, tempPassword, firstName)
      break
  }
}

// Détermine le provider par défaut selon l'environnement
function getDefaultProvider(): EmailProvider {
  if (process.env.NODE_ENV === 'development') {
    return 'console'
  }
  
  if (process.env.RESEND_API_KEY) {
    return 'resend'
  }
  
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return 'smtp'
  }
  
  return 'simulated'
}

// Envoi via Resend (service externe)
async function sendViaResend(email: string, tempPassword: string, firstName?: string): Promise<void> {
  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    await resend.emails.send({
      from: 'Deceased Status <noreply@deceased-status.com>',
      to: [email],
      subject: 'Welcome to Deceased Status - Temporary Password',
      html: generateEmailHTML(tempPassword, appUrl, firstName),
    })
    
    console.log('✅ Email sent via Resend')
  } catch (error) {
    console.error('❌ Resend failed, falling back to console:', error)
    await sendViaConsole(email, tempPassword, firstName)
  }
}

// Envoi via console (développement)
async function sendViaConsole(email: string, tempPassword: string, firstName?: string): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  console.log('=== EMAIL CONSOLE OUTPUT ===')
  console.log(`📧 To: ${email}`)
  console.log(`👤 Name: ${firstName || 'N/A'}`)
  console.log(`🔑 Temporary Password: ${tempPassword}`)
  console.log(`🔗 Login URL: ${appUrl}/login`)
  console.log('📜 Subject: Welcome to Deceased Status - Temporary Password')
  console.log('📨 Provider: Console (Development)')
  console.log('============================')
}

// Template HTML centralisé
function generateEmailHTML(tempPassword: string, appUrl: string, firstName?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to Deceased Status</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: white; padding: 40px 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Welcome to Deceased Status</h1>
      <p style="margin: 10px 0 0; opacity: 0.9; font-size: 16px;">Enterprise Death Verification Platform</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 30px; background: #f8fafc;">
      <p style="margin: 0 0 20px; font-size: 16px; color: #374151;">
        ${firstName ? `Hi ${firstName},` : 'Hello,'}
      </p>
      
      <p style="margin: 0 0 20px; font-size: 16px; color: #374151;">
        Your account has been created successfully. Your temporary password is:
      </p>
      
      <!-- Password Box -->
      <div style="background: #1e293b; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0; border: 2px solid #334155;">
        <code style="font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace; font-size: 18px; font-weight: bold; letter-spacing: 2px; color: #f1f5f9;">
          ${tempPassword}
        </code>
      </div>
      
      <!-- Warning -->
      <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 6px; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px; color: #92400e;">
          <strong>🔒 Security Notice:</strong> You'll be required to change this password on your first login for security purposes.
        </p>
      </div>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${appUrl}/login" style="display: inline-block; background: #3b82f6; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);">
          Login to Your Account
        </a>
      </div>
      
      <!-- Instructions -->
      <div style="background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 25px 0;">
        <h3 style="margin: 0 0 10px; font-size: 16px; color: #1e40af;">Next Steps:</h3>
        <ol style="margin: 0; padding-left: 20px; color: #1e40af;">
          <li>Click the login button above</li>
          <li>Enter your email and temporary password</li>
          <li>Create a new secure password</li>
          <li>Start using Deceased Status</li>
        </ol>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background: #e5e7eb; padding: 20px 30px; text-align: center; border-top: 1px solid #d1d5db;">
      <p style="margin: 0; font-size: 12px; color: #6b7280;">
        This is an automated message from Deceased Status. Please do not reply to this email.
      </p>
      <p style="margin: 5px 0 0; font-size: 12px; color: #9ca3af;">
        © 2024 Deceased Status. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`
}

// Export des fonctions individuelles pour usage spécifique
export {
  sendTempPasswordEmailCustom as sendViaSMTP,
  sendEmailNativeSMTP as sendViaNativeSMTP,
  sendEmailSimulated as sendViaSimulation,
  sendViaConsole,
}
