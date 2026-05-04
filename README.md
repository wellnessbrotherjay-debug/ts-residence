# TS Residence Website

Trigger redeploy: May 4, 2026

## Purpose
Premium long-stay apartment website for TS Residence in Seminyak, Bali. This Next.js application serves as the primary acquisition channel for capturing leads, facilitating contact inquiries, and showcasing apartment options for long-term stays.

## Business Role in HTF / TS Group
- **Website / acquisition layer** - First touchpoint for potential residents
- **Lead capture system** - Collects and qualifies leads for the CRM
- **Marketing showcase** - Displays apartment options and lifestyle benefits
- **Communication hub** - Facilitates initial contact via forms and chat

## Tech Stack
- **Frontend**: Next.js 16.2.1, React 19.2.4, TypeScript 5, Tailwind CSS v4
- **Backend**: Next.js API Routes, Server Components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: None implemented (public site)
- **Email**: Resend (notifications and auto-replies)
- **Analytics**: Google Analytics 4, Google Tag Manager, Meta Pixel
- **Chat**: OpenAI GPT-3.5 Turbo integration
- **Hosting**: Vercel

## Current Features
- Responsive design optimized for mobile and desktop
- Lead capture form with spam protection and deduplication
- Contact form with branded notifications
- AI-powered chat widget
- Comprehensive analytics tracking
- SEO optimized with structured data
- Image optimization and fallbacks
- Service worker registration for PWA features

## Routes
### Public Pages
- `/` - Homepage with hero section and apartment showcase
- `/apartments` - Apartment gallery and details
- `/contact` - Contact form and information
- `/gallery` - Image gallery of properties
- `/offers` - Special offers and promotions
- `/faq` - Frequently asked questions
- `/five-star-living` - Five-star lifestyle features
- `/easy-living` - Easy monthly stay options
- `/healthy-living` - Wellness and healthy living
- `/admin` - Basic admin dashboard for leads

### API Routes
- `POST /api/leads` - Create new leads with deduplication
- `GET /api/leads` - Retrieve recent leads (admin)
- `POST /api/contact` - Submit contact form
- `POST /api/chat` - Get chatbot responses
- `POST /api/chat/log` - Log chat messages
- `POST /api/analytics/track` - Track analytics events
- `GET /api/dashboard/summary` - Dashboard metrics
- `GET /api/image` - Image proxy with fallback

## Data Model
### Current Database Tables
- **leads** - Lead capture with UTM tracking
- **traffic_events** - User behavior and analytics
- **chat_sessions** - Chat widget sessions
- **chat_messages** - Chat conversation history

### Missing Core Tables
- **contacts** - Central contact management
- **bookings** - Booking reservations
- **apartments** - Apartment catalog
- **users** - User accounts and profiles
- **venues** - Multi-venue support
- **services** - Available services

## Integrations
### Active Integrations
- **Resend** - Email notifications and auto-replies
- **Google Analytics 4** - Web analytics and conversion tracking
- **Google Tag Manager** - Tag management and event tracking
- **Meta Pixel** - Facebook tracking and pixel events
- **Microsoft Clarity** - Session recordings (optional)
- **OpenAI** - Chatbot responses
- **Supabase** - Database and storage
- **Jarvis Command Center** - Activity logging (optional)

### Missing Integrations
- **WhatsApp/Telegram** - Messaging automation
- **Stripe** - Payment processing
- **Booking system** - Availability and reservations
- **Schedule system** - Appointment booking
- **Voucher system** - Promotions and rewards
- **SMS** - Text message notifications

## Environment Variables
### Required Variables
```bash
# Analytics
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=1234567890

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=public_key
SUPABASE_URL=https://project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=secret_key

# Email
RESEND_API_KEY=re_xxxxxxxxx

# Optional Chat
OPENAI_API_KEY=sk-xxxxxxxxxxxx

# Optional Activity Logging
JARVIS_API_URL=https://jarvis.example.com
JARVIS_API_KEY=xxxxxxxxxxxx
```

### Security Notes
- **Never commit environment variables** to version control
- Service role keys provide full database access - handle with care
- Rotate keys regularly and store securely
- Use Vercel secrets for production

## Local Development
### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Supabase project (for database)

### Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
4. Update environment variables with your values
5. Start development server:
   ```bash
   npm run dev
   ```
6. Visit `http://localhost:3000`

### Database Setup
1. Create Supabase project
2. Run the schema from `docs/supabase-schema.sql`
3. Set up RLS policies as needed
4. Configure environment variables

## Build / Test / Deploy
### Building
```bash
npm run build
```

### Testing
Currently no automated tests implemented. Recommended:
- Unit tests for API routes
- Integration tests for form submissions
- E2E tests for user journeys

### Deployment
1. Connect to Vercel:
   ```bash
   vercel
   ```
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code
- `npm run format:check` - Check formatting

## Current Status
### Complete
✅ Basic website functionality  
✅ Lead capture with deduplication  
✅ Contact form with notifications  
✅ AI chatbot integration  
✅ Comprehensive analytics tracking  
✅ Image optimization  
✅ Responsive design  
✅ SEO optimization  

### In Progress
⚠️ Admin dashboard enhancement  
⚠️ Performance optimization  
⚠️ Security hardening  

### Missing Features
❌ Booking system integration  
❌ User authentication  
❌ Payment processing  
❌ WhatsApp/Telegram automation  
❌ SMS integration  
❌ Voucher/rewards system  
❌ Advanced reporting  
❌ Multi-language support  

## Next Priorities

### Critical (Week 1-2)
1. **Security hardening**
   - Implement API authentication
   - Add rate limiting
   - Input validation
   - CSRF protection

2. **Booking system**
   - Create booking API endpoints
   - Implement availability search
   - Add payment integration

### High Priority (Week 3-4)
1. **User management**
   - Implement authentication
   - Create central contacts table
   - User profile management

2. **Communication**
   - Add WhatsApp webhook
   - Implement SMS integration
   - Enhance email templates

### Medium Priority (Week 5-6)
1. **Enhanced features**
   - Advanced reporting dashboard
   - Voucher system integration
   - Schedule system connection

2. **Performance**
   - Implement caching
   - Optimize database queries
   - Add performance monitoring

## Security Notes
- This is a public website - no authentication implemented
- All API routes are currently public - implement authentication for sensitive endpoints
- Service role keys provide full database access - handle securely
- Never expose sensitive data in client-side code
- Implement proper input validation for all forms
- Use HTTPS in production
- Consider implementing CSP headers for additional security

## Ecosystem Integration
This website is part of the HTF / TS Group ecosystem:
- **Upstream**: Marketing campaigns, paid traffic, social media
- **Downstream**: CRM system, booking system, guest app
- **Parallel**: No.1 Wellness website, other property websites

The website should connect to:
- Schedule system for booking management
- Voucher system for promotions
- Chatbot for customer service
- Guest app for resident management
- Owner command center for reporting

## Contributing
1. Follow the existing code style
2. Implement proper TypeScript types
3. Add tests for new features
4. Update documentation as needed
5. Ensure security best practices

## License
This project is proprietary and confidential.