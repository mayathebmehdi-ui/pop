# Deceased Status - Enterprise Death Verification Platform

A production-ready full-stack application for enterprise death status verification with premium dark UI, database-backed accounts, email notifications, admin controls, and bulk processing capabilities.

## 🚀 Features

### Core Features
- **Dark-only premium UI** with fintech/insurtech styling
- **Database-backed authentication** with bcrypt password hashing
- **Admin-controlled access** with user activation system
- **Email notifications** via Resend (fallback to console in dev)
- **Single search** with premium glossy search card
- **Bulk CSV/Excel upload** with BullMQ queue processing
- **API proxy** with server-side key injection (never exposed to client)
- **Real-time progress tracking** for bulk operations

### Technical Stack
- **Framework**: Next.js 14+ with App Router & TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Custom bcrypt-based auth with middleware
- **Email**: Resend API with HTML templates
- **Queue**: BullMQ with Redis for bulk processing
- **UI**: Tailwind CSS + shadcn/ui components + Framer Motion
- **Validation**: Zod schemas with server-side validation

### Security & Compliance
- **PII minimization** and data encryption
- **Audit trails** for all verification requests
- **Role-based access control** (USER/ADMIN)
- **Rate limiting** and input validation
- **Server-side API key management**

## 📁 Project Structure

```
├── app/                     # Next.js App Router
│   ├── globals.css         # Dark theme + premium styles
│   ├── layout.tsx          # Root layout with forced dark mode
│   ├── page.tsx            # Premium landing page
│   ├── login/              # Authentication pages
│   ├── request-account/    # Account request with email
│   ├── reset-password/     # Password reset flow
│   ├── app/                # Protected app routes
│   │   ├── search/         # Single search with glossy card
│   │   └── bulk/           # Bulk CSV/Excel upload
│   ├── admin/              # Admin dashboard
│   └── api/                # API routes
│       ├── death-check/    # Proxy with server-side key
│       └── bulk/           # Bulk processing endpoints
├── components/             # UI components
│   ├── ui/                 # shadcn/ui base components
│   ├── Navbar.tsx          # Navigation with user state
│   ├── Footer.tsx          # Site footer
│   ├── ResultCard.tsx      # Premium search results
│   └── [other components]
├── lib/                    # Core libraries
│   ├── db.ts              # Prisma client
│   ├── auth.ts            # Authentication utilities
│   ├── mailer.ts          # Resend email service
│   ├── queue.ts           # BullMQ setup
│   ├── validation.ts      # Zod schemas
│   └── utils.ts           # Utilities
├── prisma/                # Database schema
└── middleware.ts          # Auth & access control
```

## 🗄️ Database Schema

```prisma
model User {
  id             String   @id @default(cuid())
  email          String   @unique
  hashedPassword String
  firstName      String?
  lastName       String?
  role           Role     @default(USER) // USER | ADMIN
  isActive       Boolean  @default(false) // Admin controls access
  mustReset      Boolean  @default(true)  // Force reset temp password
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  searches       SearchRequest[]
  batches        BatchUpload[]
}

model SearchRequest {
  id        String   @id @default(cuid())
  userId    String
  payload   Json     // fname,mname?,lname,dob,city,state
  status    String   @default("queued") // queued|ok|error
  result    Json?
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}

model BatchUpload {
  id            String   @id @default(cuid())
  userId        String
  filename      String
  status        String   @default("processing") // processing|done|error
  totalRows     Int      @default(0)
  processedRows Int      @default(0)
  errorRows     Int      @default(0)
  resultUrl     String?  // Download results
  createdAt     DateTime @default(now())
  user          User     @relation(fields: [userId], references: [id])
}
```

## 🛠️ Setup & Development

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Redis server
- Resend API key (optional for dev)

### Environment Variables
Create `.env.local`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/deceased_status_db"

# Email
RESEND_API_KEY="your_resend_api_key_here"

# Death Check API
DEATH_CHECK_API_URL="https://93e08lwg2l.execute-api.us-east-1.amazonaws.com/version_one"
DEATH_CHECK_API_KEY="your_death_check_api_key_here"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_secret_here"

# Redis
REDIS_URL="redis://localhost:6379"
```

### Installation & Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up database:**
   ```bash
   npm run db:push
   npm run db:generate
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open application:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 UI Design System

### Dark Theme (Forced)
- **Backgrounds**: `slate-950` → `slate-900/800`
- **Text**: `slate-200/400` for primary/secondary
- **Accents**: `indigo-400/500` for interactive elements
- **Cards**: Premium shadows with glass morphism effects

### Search Card (Premium Glossy Design)
- **Glossy header** with subtle gradient
- **Price pill** at top right (`$0.99`)
- **Rounded-2xl** borders with layered shadows
- **Left-icon inputs** with focus rings
- **Skeleton loading** states
- **Error handling** with inline feedback

### Components
- **shadcn/ui** base components (local, no init required)
- **Framer Motion** animations (subtle, CLS-safe)
- **Premium shadows** and glass morphism
- **Responsive design** (360px → 1440px+)

## 🔐 Authentication Flow

### New User Registration
1. User submits request via `/request-account`
2. System creates user with `isActive: false, mustReset: true`
3. Generates temporary password and sends email
4. Admin manually activates user in admin panel
5. User logs in and is forced to reset password

### Access Control
- **Middleware** checks user session and active status
- **Inactive users** are blocked from all app routes
- **Admin routes** restricted to `role: ADMIN`
- **Password reset** enforced for temporary passwords

## 🔍 Search Features

### Single Search
- **Premium search card** with glossy header and price pill
- **Real-time validation** with Zod schemas
- **Server-side API proxy** (never exposes API key)
- **Confidence scoring** and match quality indicators
- **Evidence links** and audit trail storage

### Bulk Upload
- **CSV/Excel file support** with drag-and-drop
- **BullMQ queue processing** with Redis
- **Real-time progress updates** via polling
- **Error handling** and validation per row
- **Downloadable results** in CSV/JSON format

## 📊 Admin Dashboard

### User Management
- **Activate/suspend users** with toggle controls
- **Resend temporary passwords** to users
- **View user activity** and search history
- **Role management** (promote to admin)

### System Monitoring
- **Recent searches** across all users
- **Batch upload status** and progress
- **System health** and queue status
- **Usage analytics** and reporting

## 🚀 Deployment

### Production Checklist
- [ ] Set up PostgreSQL database (Neon/Supabase)
- [ ] Configure Redis instance (Upstash)
- [ ] Set Resend API key for emails
- [ ] Configure Death Check API credentials
- [ ] Set environment variables
- [ ] Deploy to Vercel/Railway/other platform

### Vercel Deployment
1. Connect GitHub repository
2. Add environment variables in dashboard
3. Deploy with automatic builds

## 📄 API Documentation

### Death Check Proxy
```bash
GET /api/death-check/search
?fname=JOHN&lname=DOE&dob=19850615&city=CHICAGO&state=IL[&mname=MIDDLE]
```

**Response:**
```json
{
  "result": "True",
  "dod": "2023-05-15",
  "dod_precision": "exact",
  "url": "https://example.com/obituary",
  "confidence": 95
}
```

### Bulk Processing
```bash
POST /api/bulk/ingest
Content-Type: multipart/form-data

{
  "file": [CSV/Excel file],
  "options": { "validateHeaders": true }
}
```

## 🧪 Testing

### Development Testing
1. **Create admin user** via database seeding
2. **Request test account** via form
3. **Activate user** in admin panel
4. **Test search functionality** with sample data
5. **Upload test CSV** for bulk processing

### Sample Test Data
```csv
fname,mname,lname,dob,city,state
JOHN,MICHAEL,DOE,1985-06-15,CHICAGO,IL
JANE,,SMITH,1990-03-22,NEW YORK,NY
```

## 📋 Production Features Checklist

- ✅ **Dark-only UI** with premium fintech styling
- ✅ **Database-backed accounts** with bcrypt passwords
- ✅ **Admin-controlled access** (isActive toggle)
- ✅ **Temporary password emails** via Resend
- ✅ **Single search form** with premium glossy card
- ✅ **Bulk CSV/Excel upload** with queue processing
- ✅ **Server-side API proxy** (key never exposed)
- ✅ **Middleware protection** for all app routes
- ✅ **Role-based access** control (USER/ADMIN)
- ✅ **Real-time progress** tracking for bulk jobs
- ✅ **Audit trails** and compliance logging
- ✅ **Premium animations** and UX polish
- ✅ **Responsive design** and accessibility
- ✅ **Production deployment** ready

## 🔧 Maintenance

### Regular Tasks
- Monitor queue health and Redis memory
- Review audit logs for compliance
- Update API rate limits as needed
- Backup database and user data
- Monitor email delivery rates

### Scaling Considerations
- Add Redis clustering for high volume
- Implement database read replicas
- Add CDN for static assets
- Consider horizontal API scaling
- Implement advanced rate limiting

---

**Built with ❤️ for enterprise death verification needs.**