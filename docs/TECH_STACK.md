# Tech Stack

## Project Identity
- **Repo name**: ts-residense-next
- **Project purpose**: TS Residence - Premium long-stay apartment website with lead capture, booking inquiry, and contact forms
- **Business module**: Real Estate / Hospitality - Apartment rentals in Seminyak, Bali
- **Ecosystem role**: Website / acquisition layer for HTF / TS Group

## Stack
### Frontend
- **Framework**: Next.js 16.2.1 (App Router)
- **Language**: TypeScript 5
- **Runtime**: React 19.2.4
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom components with Lucide React icons
- **Animation**: Motion library for animations
- **Image Gallery**: Yet Another React Lightbox

### Backend
- **API**: Next.js API Routes (Server Actions)
- **Database**: Supabase (PostgreSQL)
- **ORM**: Supabase client-side queries
- **Authentication**: None implemented (public site)

### Hosting & Deployment
- **Platform**: Vercel
- **Domain**: tsresidence.id
- **Images**: Vercel Image Optimization + Remote patterns for tsresidence.id, unsplash.com, picsum.photos, imagedelivery.net, hive68.com
- **Caching**: 1-year cache for static assets

### Third-party Services
- **Email**: Resend (form notifications and auto-replies)
- **Analytics**: 
  - Google Analytics 4 (GA4)
  - Google Tag Manager (GTM)
  - Meta Pixel
  - Microsoft Clarity (optional)
- **Chat**: OpenAI GPT-3.5 Turbo integration
- **Images**: External CDN integration

### Development Tools
- **Package Manager**: npm (with pnpm install detected in node_modules)
- **Linting**: ESLint with Next.js config
- **Formatting**: Prettier with Tailwind plugin
- **Git Hooks**: Husky + lint-staged
- **Type Checking**: TypeScript strict mode

## Scripts
| Script | Purpose | Status |
|--------|---------|--------|
| `npm run dev` | Start development server | ✅ |
| `npm run build` | Build for production | ✅ |
| `npm run start` | Start production server | ✅ |
| `npm run lint` | Run ESLint | ✅ |
| `npm run lint:fix` | Fix ESLint issues | ✅ |
| `npm run format` | Format code with Prettier | ✅ |
| `npm run format:check` | Check formatting | ✅ |
| `npm run prepare` | Install Git hooks | ✅ |

## Environment Variables
| Env Name | Purpose | Required? | Secret? | Notes |
|----------|---------|-----------|---------|-------|
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager ID | Required | No | For GTM tracking |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 ID | Required | No | For GA4 tracking |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel ID | Optional | No | For Facebook tracking |
| `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity ID | Optional | No | For session recording |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Required | No | Database connection |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public key | Required | No | Read-only access |
| `SUPABASE_URL` | Supabase project URL | Required | Yes | Full access |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Required | Yes | Admin access |
| `RESEND_API_KEY` | Resend API key | Required | Yes | Email sending |
| `OPENAI_API_KEY` | OpenAI API key | Optional | Yes | Chatbot functionality |
| `JARVIS_API_URL` | Jarvis Command Center URL | Optional | Yes | Activity logging |
| `JARVIS_API_KEY` | Jarvis API key | Optional | Yes | Activity logging |

## Key Features
- Responsive design with mobile-first approach
- Lead capture with spam protection and deduplication
- Contact form with branded notifications
- AI-powered chat widget
- Comprehensive analytics tracking
- SEO optimized with structured data
- Image optimization and fallbacks
- Service worker registration