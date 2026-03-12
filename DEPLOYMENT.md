# Production Deployment Guide

## 🔐 Security Configuration

### 1. Supabase Edge Function Secrets

Set these secrets in your Supabase project dashboard under **Project Settings > Secrets**:

```
PAYSTACK_SECRET_KEY=sk_live_your_paystack_secret_key_here
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

**Important**: Use `sk_live_` keys for production, `sk_test_` for testing.

### 2. Environment Variables

Update your `.env.production` file (create if doesn't exist):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_API_URL=https://yourdomain.com
VITE_ENV_MODE=production
```

## 🚀 Deployment Steps

### Step 1: Prepare Build

```bash
# Install dependencies
npm install

# Run linter (optional but recommended)
npm run lint

# Build for production
npm run build
```

### Step 2: Deploy Edge Function

```bash
# Deploy the payment function with secrets
supabase functions deploy initialize-payment --prod

# Verify deployment
supabase functions list --prod
```

### Step 3: Deploy Frontend

**Option A: Vercel (Recommended for React/Vite)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
# Add: VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY
```

**Option B: Netlify**

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist

# Configure in netlify.toml:
[build]
  command = "npm run build"
  publish = "dist"

[env]
  VITE_SUPABASE_URL = "https://your-project.supabase.co"
  VITE_SUPABASE_PUBLISHABLE_KEY = "your_key"
```

**Option C: Self-hosted**

```bash
# Build static files
npm run build

# Upload 'dist' folder to your web server
# Set up CORS and security headers in nginx/Apache
```

## 📋 Security Headers Configuration

### Nginx Configuration

```nginx
server {
  listen 443 ssl http2;
  server_name loveblooms.wedding www.loveblooms.wedding;

  # Security Headers
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "DENY" always;
  add_header X-XSS-Protection "1; mode=block" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;

  # Compression
  gzip on;
  gzip_types application/javascript text/css;
  gzip_min_length 1000;

  location / {
    root /var/www/dist;
    try_files $uri $uri/ /index.html;
  }
}
```

### Apache Configuration

```apache
<VirtualHost *:443>
  ServerName loveblooms.wedding
  ServerAlias www.loveblooms.wedding

  # Security Headers
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "DENY"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"

  # GZIP Compression
  <IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/javascript application/javascript
  </IfModule>

  DocumentRoot /var/www/dist

  <Directory /var/www/dist>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
  </Directory>
</VirtualHost>
```

## 🧪 Testing Before Production

### 1. Test Payment Flow

```bash
# Use Paystack test keys with these test cards:
# Success: 5399 8385 0012 3456, CVV: 123
# Decline: 5577 7778 0012 3452, CVV: 456
```

### 2. CORS Testing

```bash
# Should return valid CORS headers
curl -H "Origin: https://loveblooms.wedding" \
  -H "Access-Control-Request-Method: POST" \
  https://your-project.supabase.co/functions/v1/initialize-payment
```

### 3. Performance Testing

```bash
# Check bundle size
npm run build
# Look at dist folder size

# Lighthouse audit
# Use Chrome DevTools > Lighthouse or
# Visit: https://pagespeed.web.dev
```

## 📊 Performance Targets

After optimizations, target these metrics:

- **Lighthouse Score**: ≥90
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1
- **Time to Interactive**: <3s
- **Total Bundle Size**: <150KB (gzipped)

## 🔄 Maintenance

### Monthly

- Review Supabase logs for payment errors
- Check Paystack transaction success rates
- Monitor bundle size with PR previews

### Quarterly

- Update dependencies: `npm update`
- Run security audit: `npm audit`
- Review and rotate Paystack secret keys

### Annually

- Review and update CSP headers
- Audit third-party dependencies
- Performance optimization review

## 🚨 Troubleshooting

### Payment Fails at Authorization

- Check `PAYSTACK_SECRET_KEY` is set correctly
- Verify `ALLOWED_ORIGINS` includes your domain
- Check Paystack dashboard for API errors

### CORS Errors

- Verify domain is in `ALLOWED_ORIGINS`
- Check Edge Function was deployed: `supabase functions list --prod`
- Clear browser cache and try again

### Build Fails

- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be ≥16)
- Check for TypeScript errors: `npm run build`

### Slow Performance

- Run Lighthouse: Chrome DevTools > Lighthouse
- Check Network tab for large assets
- Verify images are optimized (WebP format)
- Check if service worker is cached: Dev Tools > Application > Service Workers
