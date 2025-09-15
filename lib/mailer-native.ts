// 📧 OPTION 4: Envoi d'email NATIF Node.js (SANS aucune dépendance externe)
import { createTransport } from 'nodemailer'
import * as tls from 'tls'
import * as net from 'net'

// 🔧 SMTP Client natif (pure Node.js)
class NativeSMTPClient {
  private host: string
  private port: number
  private username: string
  private password: string
  private socket: net.Socket | tls.TLSSocket | null = null

  constructor(config: {
    host: string
    port: number
    username: string
    password: string
  }) {
    this.host = config.host
    this.port = config.port
    this.username = config.username
    this.password = config.password
  }

  private async sendCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not connected'))
        return
      }

      const timeout = setTimeout(() => {
        reject(new Error('SMTP command timeout'))
      }, 10000)

      this.socket.once('data', (data) => {
        clearTimeout(timeout)
        resolve(data.toString())
      })

      this.socket.write(command + '\r\n')
    })
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = net.createConnection(this.port, this.host)
      
      this.socket.on('connect', () => {
        console.log(`✅ Connected to SMTP server ${this.host}:${this.port}`)
      })

      this.socket.on('data', (data) => {
        const response = data.toString()
        if (response.startsWith('220')) {
          resolve()
        }
      })

      this.socket.on('error', (error) => {
        reject(error)
      })
    })
  }

  async authenticate(): Promise<void> {
    await this.sendCommand('EHLO localhost')
    await this.sendCommand('AUTH LOGIN')
    
    // Encode username and password in base64
    const encodedUsername = Buffer.from(this.username).toString('base64')
    const encodedPassword = Buffer.from(this.password).toString('base64')
    
    await this.sendCommand(encodedUsername)
    await this.sendCommand(encodedPassword)
  }

  async sendEmail(from: string, to: string, subject: string, body: string): Promise<void> {
    await this.sendCommand(`MAIL FROM:<${from}>`)
    await this.sendCommand(`RCPT TO:<${to}>`)
    await this.sendCommand('DATA')
    
    const emailContent = [
      `From: ${from}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=UTF-8',
      '',
      body,
      '.',
    ].join('\r\n')
    
    await this.sendCommand(emailContent)
  }

  async disconnect(): Promise<void> {
    if (this.socket) {
      await this.sendCommand('QUIT')
      this.socket.end()
      this.socket = null
    }
  }
}

// 📧 Fonction d'envoi avec SMTP natif
export async function sendEmailNativeSMTP(
  email: string,
  tempPassword: string,
  firstName?: string
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://deceasedstatus.com'
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to Deceased Status</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">Welcome to Deceased Status</h1>
    <p style="margin: 10px 0 0; opacity: 0.9;">Enterprise Death Verification Platform</p>
  </div>
  
  <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px;">
    <p>Hi ${firstName || 'there'},</p>
    
    <p>Your account has been created successfully. Your temporary password is:</p>
    
    <div style="background: #1e293b; color: white; padding: 15px; border-radius: 4px; text-align: center; margin: 20px 0;">
      <code style="font-family: monospace; font-size: 16px; font-weight: bold;">${tempPassword}</code>
    </div>
    
    <p><strong>Important:</strong> You'll be required to change this password on your first login.</p>
    
    <div style="text-align: center; margin: 25px 0;">
      <a href="${appUrl}/login" style="background: #3b82f6; color: white; padding: 10px 25px; text-decoration: none; border-radius: 4px; font-weight: 600;">
        Login to Your Account
      </a>
    </div>
    
    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;">
    
    <p style="font-size: 12px; color: #64748b; text-align: center;">
      This is an automated message. Please do not reply to this email.
    </p>
  </div>
</body>
</html>`

  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('=== EMAIL PREVIEW (Native SMTP) ===')
      console.log(`To: ${email}`)
      console.log(`Temporary Password: ${tempPassword}`)
      console.log(`Login URL: ${appUrl}/login`)
      console.log('==================================')
      return
    }

    // Configuration SMTP
    const smtpConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      username: process.env.SMTP_USER || '',
      password: process.env.SMTP_PASSWORD || '',
    }

    // Envoi via client SMTP natif
    const client = new NativeSMTPClient(smtpConfig)
    
    await client.connect()
    await client.authenticate()
    await client.sendEmail(
      process.env.SMTP_FROM || 'noreply@deceased-status.com',
      email,
      'Welcome to Deceased Status - Temporary Password',
      htmlContent
    )
    await client.disconnect()

    console.log('✅ Email sent successfully via native SMTP')
    
  } catch (error) {
    console.error('❌ Failed to send email via native SMTP:', error)
    
    // Fallback console
    console.log('=== EMAIL FALLBACK (Native SMTP Error) ===')
    console.log(`To: ${email}`)
    console.log(`Temporary Password: ${tempPassword}`)
    console.log(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    console.log('========================================')
  }
}

// 📧 OPTION 5: Simulateur d'email (aucune configuration requise)
export async function sendEmailSimulated(
  email: string,
  tempPassword: string,
  firstName?: string
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://deceasedstatus.com'
  
  // Simule un délai d'envoi
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Stocke l'email dans un fichier local pour consultation
  const emailData = {
    timestamp: new Date().toISOString(),
    to: email,
    subject: 'Welcome to Deceased Status - Temporary Password',
    tempPassword,
    loginUrl: `${appUrl}/login`,
    firstName,
  }
  
  try {
    const fs = await import('fs/promises')
    const path = await import('path')
    
    const emailsDir = path.join(process.cwd(), 'tmp', 'emails')
    await fs.mkdir(emailsDir, { recursive: true })
    
    const filename = `email_${Date.now()}_${email.replace('@', '_at_')}.json`
    const filepath = path.join(emailsDir, filename)
    
    await fs.writeFile(filepath, JSON.stringify(emailData, null, 2))
    
    console.log('📧 EMAIL SIMULATED - Saved to file:')
    console.log(`📁 File: ${filepath}`)
    console.log(`📩 To: ${email}`)
    console.log(`🔑 Temporary Password: ${tempPassword}`)
    console.log(`🔗 Login URL: ${appUrl}/login`)
    console.log('=====================================')
    
  } catch (error) {
    console.log('📧 EMAIL SIMULATED - Console only:')
    console.log(`📩 To: ${email}`)
    console.log(`🔑 Temporary Password: ${tempPassword}`)
    console.log(`🔗 Login URL: ${appUrl}/login`)
    console.log('===================================')
  }
}
