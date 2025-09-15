import nodemailer from 'nodemailer'
import { Resend } from 'resend'

// Initialize Resend only if API key is provided
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// 🔥 VRAI SYSTÈME EMAIL - Envoie de vrais emails !
export async function sendTempPasswordEmail(
  email: string,
  tempPassword: string,
  firstName?: string
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://deceasedstatus.com'
  
  // Template HTML premium
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to Deceased Status</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: white; padding: 40px 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">🏢 Deceased Status</h1>
      <p style="margin: 10px 0 0; opacity: 0.9; font-size: 16px;">Enterprise Death Verification Platform</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 30px;">
      <h2 style="color: #1e293b; margin-bottom: 20px;">Welcome ${firstName ? firstName : 'aboard'}! 👋</h2>
      
      <p style="margin: 0 0 20px; font-size: 16px; color: #374151;">
        Your account has been successfully created. Here's your temporary password:
      </p>
      
      <!-- Password Box -->
      <div style="background: #1e293b; color: white; padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0; border: 2px solid #334155; box-shadow: 0 4px 12px rgba(30, 41, 59, 0.3);">
        <p style="margin: 0 0 10px; font-size: 14px; opacity: 0.8;">Your temporary password:</p>
        <code style="font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace; font-size: 20px; font-weight: bold; letter-spacing: 3px; color: #60a5fa; background: rgba(96, 165, 250, 0.1); padding: 8px 16px; border-radius: 6px;">
          ${tempPassword}
        </code>
      </div>
      
      <!-- Warning -->
      <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px; color: #92400e;">
          <strong>🔒 Security Notice:</strong> You'll be required to change this password on your first login for security purposes.
        </p>
      </div>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin: 35px 0;">
        <a href="${appUrl}/login" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4); transition: transform 0.2s;">
          🚀 Login to Your Account
        </a>
      </div>
      
      <!-- Instructions -->
      <div style="background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
        <h3 style="margin: 0 0 12px; font-size: 16px; color: #1e40af;">📋 Next Steps:</h3>
        <ol style="margin: 0; padding-left: 20px; color: #1e40af; line-height: 1.6;">
          <li>Click the login button above</li>
          <li>Enter your email: <strong>${email}</strong></li>
          <li>Use the temporary password from this email</li>
          <li>Create a new secure password</li>
          <li>Start using Deceased Status! 🎉</li>
        </ol>
      </div>
      
      <!-- Support -->
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; font-size: 14px; color: #6b7280;">
          Need help? Contact us at <a href="mailto:support@deceased-status.com" style="color: #3b82f6;">support@deceased-status.com</a>
        </p>
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

  try {
    // 🔥 CONFIGURATION AUTOMATIQUE - Détecte le provider email
    let transporter
    
    // 🚨 DEBUG - Affiche toutes les variables d'environnement email
    console.log('🔍 DEBUG EMAIL CONFIG:')
    console.log('SMTP_HOST:', process.env.SMTP_HOST ? '✅ SET' : '❌ NOT SET')
    console.log('SMTP_USER:', process.env.SMTP_USER ? '✅ SET' : '❌ NOT SET') 
    console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? '✅ SET' : '❌ NOT SET')
    console.log('SMTP_PORT:', process.env.SMTP_PORT || 'DEFAULT 587')
    console.log('GMAIL_USER:', process.env.GMAIL_USER ? '✅ SET' : '❌ NOT SET')
    console.log('GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? '✅ SET' : '❌ NOT SET')
    console.log('')
    
    // Si variables Gmail configurées
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      console.log('📧 Using Gmail SMTP...')
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      })
    }
    // Si variables SMTP configurées
    else if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      console.log('📧 Using custom SMTP...')
      console.log(`📧 Connecting to: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT || '587'}`)
      console.log(`📧 Auth user: ${process.env.SMTP_USER}`)
      
      const port = parseInt(process.env.SMTP_PORT || '587')
      const secure = process.env.SMTP_SECURE === 'true' || port === 465
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
        // 🔧 Options de debug
        logger: true,
        debug: true,
      })
    }
    // Si clé Resend configurée (fallback)
    else if (process.env.RESEND_API_KEY) {
      console.log('📧 Using Resend API...')
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      
      await resend.emails.send({
        from: 'Deceased Status <noreply@deceased-status.com>',
        to: [email],
        subject: '🔑 Welcome to Deceased Status - Your Temporary Password',
        html: htmlContent,
      })
      
      console.log('✅ Email sent successfully via Resend!')
      return
    }
    
    // Envoi via SMTP si configuré
    if (transporter) {
      const mailOptions = {
        from: `"Deceased Status" <${process.env.SMTP_FROM || process.env.GMAIL_USER || 'noreply@deceased-status.com'}>`,
        to: email,
        subject: '🔑 Welcome to Deceased Status - Your Temporary Password',
        html: htmlContent,
        text: `
Welcome to Deceased Status!

Your temporary password is: ${tempPassword}

Please login at: ${appUrl}/login

Important: You'll be required to change this password on your first login.

Best regards,
The Deceased Status Team
        `,
      }

      const info = await transporter.sendMail(mailOptions)
      console.log('✅ Email sent successfully!')
      console.log(`📧 Message ID: ${info.messageId}`)
      console.log(`📬 Sent to: ${email}`)
      
      return
    }
    
    // Si aucune config email → Mode console comme fallback
    throw new Error('No email configuration found')
    
  } catch (error) {
    console.error('❌ Failed to send email:', error)
    
    // 🔄 FALLBACK - Affichage console si email échoue
    console.log('')
    console.log('🚀 ========================================')
    console.log('📧 EMAIL FALLBACK - DECEASED STATUS')
    console.log('🚀 ========================================')
    console.log('')
    console.log(`👤 Email: ${email}`)
    console.log(`📝 Name: ${firstName || 'Not specified'}`)
    console.log('')
    console.log('🔑 TEMPORARY PASSWORD:')
    console.log(`   ┌─────────────────────────────┐`)
    console.log(`   │     ${tempPassword}     │`)
    console.log(`   └─────────────────────────────┘`)
    console.log('')
    console.log(`🔗 Login URL: ${appUrl}/login`)
    console.log('')
    console.log('⚠️  Configure email to receive real emails!')
    console.log('   Set GMAIL_USER and GMAIL_APP_PASSWORD in .env.local')
    console.log('')
    console.log('🚀 ========================================')
    console.log('')
  }
}

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  firstName?: string
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://deceasedstatus.com'
  const resetUrl = `${appUrl}/reset-password?token=${resetToken}`
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Password Reset - Deceased Status</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Password Reset</h1>
    <p style="margin: 10px 0 0; opacity: 0.9; font-size: 16px;">Deceased Status</p>
  </div>
  
  <div style="background: #f8fafc; padding: 40px 30px; border-radius: 0 0 12px 12px;">
    <p style="margin: 0 0 20px; font-size: 16px;">
      ${firstName ? `Hi ${firstName},` : 'Hello,'}
    </p>
    
    <p style="margin: 0 0 20px; font-size: 16px;">
      You requested a password reset for your Deceased Status account. Click the button below to set a new password:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
        Reset Your Password
      </a>
    </div>
    
    <p style="margin: 20px 0; font-size: 14px; color: #64748b;">
      If you didn't request this reset, please ignore this email. The reset link will expire in 24 hours.
    </p>
    
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
      console.log('=== PASSWORD RESET EMAIL (Development) ===')
      console.log(`To: ${email}`)
      console.log(`Reset URL: ${resetUrl}`)
      console.log('==========================================')
      return
    }
    
    if (resend) {
      await resend.emails.send({
        from: 'Deceased Status <noreply@deceased-status.com>',
        to: [email],
        subject: 'Password Reset - Deceased Status',
        html: htmlContent,
      })
    } else {
      console.log('⚠️ No Resend API key configured')
    }
  } catch (error) {
    console.error('Failed to send password reset email:', error)
    console.log('=== PASSWORD RESET FALLBACK ===')
    console.log(`To: ${email}`)
    console.log(`Reset URL: ${resetUrl}`)
    console.log('===============================')
  }
}

export async function sendAdminNotificationEmail({
  userEmail,
  userName,
  userId
}: {
  userEmail: string
  userName: string
  userId: string
}) {
  const adminEmail = process.env.ADMIN_APPROVER_EMAIL || 'support@deceasedstatus.com'
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://deceasedstatus.com'}/admin`
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a365d; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f8f9fa; }
        .button { display: inline-block; background: #3182ce; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 10px 0; }
        .user-info { background: white; padding: 15px; border-left: 4px solid #3182ce; margin: 15px 0; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 New Account Pending Approval</h1>
        </div>
        
        <div class="content">
          <p>Hello Peter,</p>
          
          <p>A new user has completed their account setup and is awaiting approval to access the Deceased Status verification system.</p>
          
          <div class="user-info">
            <h3>User Details:</h3>
            <p><strong>Name:</strong> ${userName}</p>
            <p><strong>Email:</strong> ${userEmail}</p>
            <p><strong>Account Created:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>User ID:</strong> ${userId}</p>
          </div>
          
          <p>Please review this account and take appropriate action:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${dashboardUrl}" class="button">
              🛡️ Review in Admin Dashboard
            </a>
          </div>
          
          <p><strong>Next Steps:</strong></p>
          <ol>
            <li>Log into your admin dashboard</li>
            <li>Navigate to "Pending Approvals"</li>
            <li>Review the user's information</li>
            <li>Approve or reject the account request</li>
          </ol>
          
          <p>The user will be notified once you make your decision.</p>
        </div>
        
        <div class="footer">
          <p>This is an automated notification from Deceased Status.</p>
          <p>Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `
  
  const textContent = `
New Account Pending Approval

Hello Peter,

A new user has completed their account setup and is awaiting approval.

User Details:
- Name: ${userName}
- Email: ${userEmail}
- Account Created: ${new Date().toLocaleString()}
- User ID: ${userId}

Please review this account in your admin dashboard: ${dashboardUrl}

Next Steps:
1. Log into your admin dashboard
2. Navigate to "Pending Approvals"
3. Review the user's information
4. Approve or reject the account request

The user will be notified once you make your decision.
  `

  try {
    // Prefer SMTP if configured (same behavior as temp password emails)
    let transporter: nodemailer.Transporter | undefined
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
      })
    } else if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      const port = parseInt(process.env.SMTP_PORT || '587')
      const secure = process.env.SMTP_SECURE === 'true' || port === 465
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
        logger: true,
        debug: true,
      })
    }

    if (transporter) {
      await transporter.sendMail({
        from: `Deceased Status <${process.env.SMTP_FROM || process.env.GMAIL_USER || 'noreply@deceased-status.com'}>`,
        to: [adminEmail],
        subject: `🔔 New Account Pending Approval - ${userName}`,
        html: htmlContent,
        text: textContent,
      })
      console.log(`✅ Admin notification email sent to ${adminEmail} via SMTP`)
      return
    }

    // Fallback to Resend if available
    if (process.env.RESEND_API_KEY) {
      console.log('📧 Sending admin notification via Resend...')
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      
      await resend.emails.send({
        from: 'Deceased Status <noreply@deceased-status.com>',
        to: [adminEmail],
        subject: `🔔 New Account Pending Approval - ${userName}`,
        html: htmlContent,
        text: textContent
      })
      
      console.log(`✅ Admin notification email sent to ${adminEmail}`)
    } else {
      console.log('⚠️ No Resend API key configured - Admin notification fallback')
      console.log('=== ADMIN NOTIFICATION FALLBACK ===')
      console.log(`To: ${adminEmail}`)
      console.log(`Subject: New Account Pending Approval - ${userName}`)
      console.log(`User: ${userName} (${userEmail})`)
      console.log(`Dashboard: ${dashboardUrl}`)
      console.log('=====================================')
    }
  } catch (error) {
    console.error('Failed to send admin notification email:', error)
    throw error
  }
}

export async function sendApprovalStatusEmail({
  userEmail,
  userName,
  status,
  reason
}: {
  userEmail: string
  userName: string
  status: 'APPROVED' | 'REJECTED'
  reason?: string
}) {
  const isApproved = status === 'APPROVED'
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://deceasedstatus.com'}/login`
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: ${isApproved ? '#065f46' : '#7f1d1d'}; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f8f9fa; }
        .button { display: inline-block; background: ${isApproved ? '#059669' : '#dc2626'}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 10px 0; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .alert { padding: 15px; border-radius: 4px; margin: 15px 0; }
        .success { background: #d1fae5; border: 1px solid #10b981; color: #065f46; }
        .error { background: #fee2e2; border: 1px solid #ef4444; color: #7f1d1d; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${isApproved ? '✅' : '❌'} Account ${isApproved ? 'Approved' : 'Rejected'}</h1>
        </div>
        
        <div class="content">
          <p>Hello ${userName},</p>
          
          ${isApproved ? `
            <div class="alert success">
              <p><strong>Good news!</strong> Your Deceased Status account has been approved.</p>
            </div>
            
            <p>You can now log in and start using our verification services:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${loginUrl}" class="button">
                🚀 Log In Now
              </a>
            </div>
            
            <p>If you have any questions about using the platform, please don't hesitate to contact our support team.</p>
          ` : `
            <div class="alert error">
              <p><strong>We're sorry.</strong> Your Deceased Status account request has not been approved at this time.</p>
            </div>
            
            ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
            
            <p>If you believe this decision was made in error or if you have additional information to provide, please contact our support team.</p>
          `}
        </div>
        
        <div class="footer">
          <p>This is an automated notification from Deceased Status.</p>
          <p>Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `
  
  const textContent = `
Account ${isApproved ? 'Approved' : 'Rejected'}

Hello ${userName},

${isApproved ? `
Good news! Your Deceased Status account has been approved.

You can now log in and start using our verification services: ${loginUrl}

If you have any questions about using the platform, please don't hesitate to contact our support team.
` : `
We're sorry. Your Deceased Status account request has not been approved at this time.

${reason ? `Reason: ${reason}` : ''}

If you believe this decision was made in error or if you have additional information to provide, please contact our support team.
`}
  `

  try {
    if (process.env.RESEND_API_KEY) {
      console.log(`📧 Sending ${status} notification via Resend...`)
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      
      await resend.emails.send({
        from: 'Deceased Status <noreply@deceased-status.com>',
        to: [userEmail],
        subject: `Account ${isApproved ? 'Approved' : 'Rejected'} - Deceased Status`,
        html: htmlContent,
        text: textContent
      })
      
      console.log(`✅ ${status} notification email sent to ${userEmail}`)
    } else {
      console.log(`⚠️ No Resend API key configured - ${status} notification fallback`)
      console.log(`=== ${status} NOTIFICATION FALLBACK ===`)
      console.log(`To: ${userEmail}`)
      console.log(`Subject: Account ${isApproved ? 'Approved' : 'Rejected'}`)
      console.log(`Status: ${status}`)
      if (reason) console.log(`Reason: ${reason}`)
      console.log('=======================================')
    }
  } catch (error) {
    console.error(`Failed to send ${status} notification email:`, error)
    throw error
  }
}

// Notify admin immediately when a new account request is submitted
export async function sendAdminAccountRequestEmail({
  company,
  email,
  useCase,
  expectedVolume,
  message,
  userId,
  ip,
  userAgent,
  createdAt,
}: {
  company: string
  email: string
  useCase: string
  expectedVolume: string
  message?: string
  userId?: string | null
  ip?: string | null
  userAgent?: string | null
  createdAt?: string
}) {
  const adminEmail = process.env.ADMIN_APPROVER_EMAIL || 'Mehdi.lakhdhar2020@gmail.com'
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://deceasedstatus.com'}/admin`

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 680px; margin: 0 auto; padding: 20px; }
        .header { background: #111827; color: white; padding: 18px 20px; text-align: left; }
        .content { padding: 20px; background: #f9fafb; }
        .block { background: white; border-left: 4px solid #2563eb; padding: 14px 16px; margin: 12px 0; }
        .muted { color: #6b7280; font-size: 12px; }
        .label { display:inline-block; min-width: 160px; color:#374151; font-weight:600; }
        .button { display: inline-block; background: #2563eb; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; margin: 14px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin:0">📩 New Account Request</h2>
        </div>
        <div class="content">
          <div class="block">
            <div><span class="label">Company</span> ${company}</div>
            <div><span class="label">Email</span> ${email}</div>
            <div><span class="label">Use Case</span> ${useCase}</div>
            <div><span class="label">Expected Volume</span> ${expectedVolume}</div>
            ${message ? `<div><span class="label">Message</span> ${message}</div>` : ''}
            ${userId ? `<div><span class="label">User ID</span> ${userId}</div>` : ''}
            ${createdAt ? `<div><span class="label">Created At</span> ${createdAt}</div>` : ''}
            ${ip ? `<div><span class="label">IP</span> ${ip}</div>` : ''}
            ${userAgent ? `<div><span class="label">User Agent</span> ${userAgent}</div>` : ''}
          </div>

          <p>Please review and approve this account from the admin dashboard:</p>
          <p>
            <a href="${dashboardUrl}" class="button">Open Admin Dashboard</a>
          </p>

          <p class="muted">This is an automated notification from Deceased Status.</p>
        </div>
      </div>
    </body>
    </html>
  `

  const textContent = `New Account Request\n\nCompany: ${company}\nEmail: ${email}\nUse Case: ${useCase}\nExpected Volume: ${expectedVolume}${message ? `\nMessage: ${message}` : ''}${userId ? `\nUser ID: ${userId}` : ''}${createdAt ? `\nCreated At: ${createdAt}` : ''}${ip ? `\nIP: ${ip}` : ''}${userAgent ? `\nUser Agent: ${userAgent}` : ''}\n\nAdmin: ${dashboardUrl}`

  try {
    let transporter: nodemailer.Transporter | undefined
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
      })
    } else if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      const port = parseInt(process.env.SMTP_PORT || '587')
      const secure = process.env.SMTP_SECURE === 'true' || port === 465
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
        logger: true,
        debug: true,
      })
    }

    if (transporter) {
      await transporter.sendMail({
        from: `Deceased Status <${process.env.SMTP_FROM || process.env.GMAIL_USER || 'noreply@deceased-status.com'}>`,
        to: [adminEmail],
        subject: `New Account Request - ${company}`,
        html: htmlContent,
        text: textContent,
      })
      console.log(`✅ Admin account request email sent to ${adminEmail} via SMTP`)
      return
    }

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'Deceased Status <noreply@deceased-status.com>',
        to: [adminEmail],
        subject: `New Account Request - ${company}`,
        html: htmlContent,
        text: textContent,
      })
      console.log(`✅ Admin account request email sent to ${adminEmail} via Resend`)
      return
    }

    console.log('⚠️ No email provider configured for admin account request email')
  } catch (error) {
    console.error('Failed to send admin account request email:', error)
  }
}
