# Security and Environment

## Security Assessment

### Authentication & Authorization
| Area | Risk Level | Evidence | Recommendation |
|------|------------|----------|---------------|
| **Public API Access** | **Critical** | All API routes are accessible without authentication | Implement API authentication keys for sensitive endpoints |
| **Admin Dashboard** | **High** | `/admin` route accessible without auth | Implement role-based access control for admin routes |
| **Lead Data Exposure** | **High** | Leads endpoint returns all data without filtering | Implement pagination, filtering, and access controls |
| **Service Role Key Exposure** | **High** | Service role key in env files | Rotate keys immediately, use role-based access |
| **Form Data Security** | **Medium** | No CSRF protection on forms | Add CSRF tokens to form submissions |
| **Email Injection** | **Medium** | No input sanitization before email sending | Implement email header injection protection |

### Environment Security
| Area | Risk Level | Evidence | Recommendation |
|------|------------|----------|---------------|
| **Secrets in Code** | **High** | Service role key in .env.example | Move secrets to secure vault, remove from examples |
| **Environment Variables** | **Medium** | Multiple .env files with different secrets | Consolidate into single secure env management |
| **Hardcoded Keys** | **High** | Resend API key in contact route | Move to environment variables only |
| **Public Config** | **Low** | NEXT_PUBLIC_* variables expose keys | Review public variables for necessity |
| **Development Secrets** | **Medium** | .env.local checked in (potentially) | Ensure .env* files in .gitignore |

### Data Protection
| Area | Risk Level | Evidence | Recommendation |
|------|------------|----------|---------------|
| **PII Storage** | **Medium** | Phone numbers, emails stored in plain text | Consider data masking or encryption for sensitive fields |
| **Database Access** | **High** | Service role key allows full DB access | Implement row-level security (RLS) policies |
| **API Data Logging** | **Medium** | No data sanitization in logs | Implement log data masking for PII |
| **Cross-Site Scripting** | **Medium** | No CSP headers for script sources | Implement Content Security Policy headers |
| **SQL Injection** | **Low** | Using Supabase client (parameterized queries) | Continue using ORM/parameterized queries |

### Network Security
| Area | Risk Level | Evidence | Recommendation |
|------|------------|----------|---------------|
| **CORS Configuration** | **High** | No explicit CORS policies | Restrict CORS to trusted domains only |
| **HTTPS Enforcement** | **Medium** | No HSTS headers | Add HSTS headers for production |
| **API Rate Limiting** | **Critical** | No rate limiting on endpoints | Implement rate limiting to prevent abuse |
| **Webhook Verification** | **High** | No signature verification for webhooks | Implement webhook signature validation |
| **DDoS Protection** | **Medium** | No DDoS mitigation visible | Consider Vercel DDoS protection or WAF |

### Code Security
| Area | Risk Level | Evidence | Recommendation |
|------|------------|----------|---------------|
| **Dependency Vulnerabilities** | **Medium** | Using package.json without audit reports | Run npm audit regularly, update dependencies |
| **Input Validation** | **High** | Basic validation only, no sanitization | Implement comprehensive input validation |
| **Error Handling** | **Medium** | Generic error messages may expose info | Sanitize error messages, implement proper logging |
| **Debug Code** | **Low** | No debug code visible | Ensure no debug code in production |

### Content Security
| Area | Risk Level | Evidence | Recommendation |
|------|------------|----------|---------------|
| **Content Security Policy** | **High** | CSP headers allow 'unsafe-inline', 'unsafe-eval' | Restrict CSP to specific trusted sources only |
| **External Scripts** | **Medium** | Loading external tracking scripts | Host critical scripts locally or use signed CDN URLs |
| **Image Security** | **Low** | No image size/Type restrictions | Consider implementing image validation |

## Environment Variables Review

### Current Environment Variables

#### Required Secrets (HIGH RISK)
| Variable | Risk | Notes |
|----------|------|-------|
| `SUPABASE_SERVICE_ROLE_KEY` | **High** | Full database access |
| `RESEND_API_KEY` | **High** | Email sending capabilities |
| `OPENAI_API_KEY` | **High** | AI service access |
| `JARVIS_API_KEY` | **High** | Activity logging access |
| `JARVIS_API_URL` | **Medium** | External API endpoint |

#### Public Configuration (LOW RISK)
| Variable | Risk | Notes |
|----------|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Low | Public database URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Low | Read-only access |
| `NEXT_PUBLIC_GTM_ID` | Low | Public tracking ID |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Low | Public GA ID |
| `NEXT_PUBLIC_META_PIXEL_ID` | Low | Public Pixel ID |

### Recommended Environment Changes

1. **Immediate Actions (Critical)**
   ```bash
   # Remove service role key from .env.example
   # Add to .env.local only
   
   # Implement environment variable validation
   # Add scripts/validate-env.js
   
   # Use secret management service
   # Vercel Secrets or HashiCorp Vault
   ```

2. **Security Headers** (Add to next.config.ts)
   ```typescript
   headers: [
     {
       source: '/(.*)',
       headers: [
         { key: 'X-Content-Type-Options', value: 'nosniff' },
         { key: 'X-Frame-Options', value: 'DENY' },
         { key: 'X-XSS-Protection', value: '1; mode=block' },
       ],
     },
   ]
   ```

3. **CORS Configuration** (Add middleware)
   ```typescript
   // Create middleware for CORS
   const allowedOrigins = ['https://tsresidence.id', 'https://www.tsresidence.id'];
   
   export function middleware(request: NextRequest) {
     const origin = request.headers.get('origin');
     if (allowedOrigins.includes(origin)) {
       return new NextResponse(null, {
         headers: {
           'Access-Control-Allow-Origin': origin,
           'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
           'Access-Control-Allow-Headers': 'Content-Type, Authorization',
         },
       });
     }
   }
   ```

## Security Best Practices Implementation

### 1. API Security
```typescript
// Implement API authentication
async function authenticateRequest(request: Request) {
  const apiKey = request.headers.get('x-api-key');
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

// Add rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

### 2. Form Security
```typescript
// Add CSRF protection
const csrfToken = generateCSRFToken();

// Implement email header injection protection
function sanitizeEmailHeaders(email: string) {
  return email.replace(/[\r\n]/g, '').replace(/[^a-zA-Z0-9@.-]/g, '');
}
```

### 3. Database Security
```typescript
// Implement RLS policies
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own leads" ON leads
  FOR SELECT USING (auth.uid() = created_by);
```

### 4. Input Validation
```typescript
// Use a validation library like Zod
import { z } from 'zod';

const leadSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().max(1000),
});

const validatedData = leadSchema.parse(formData);
```

## Incident Response Plan

### Security Incidents
1. **API Key Compromise**
   - Immediate action: Revoke and rotate keys
   - Investigation: Check logs for unauthorized access
   - Communication: Notify affected parties if necessary

2. **Data Breach**
   - Immediate action: Isolate affected systems
   - Investigation: Determine scope of breach
   - Communication: Follow data breach notification laws

3. **DDoS Attack**
   - Immediate action: Enable Vercel DDoS protection
   - Investigation: Analyze attack patterns
   - Mitigation: Implement rate limiting

### Monitoring and Alerts
1. Set up security monitoring for:
   - Unusual API usage patterns
   - Failed login attempts (if auth implemented)
   - Database access anomalies
   
2. Implement alerts for:
   - High error rates
   - Suspicious request patterns
   - Environment variable changes

### Regular Security Audits
1. Quarterly security reviews
2. Penetration testing
3. Dependency vulnerability scanning
4. Code security reviews