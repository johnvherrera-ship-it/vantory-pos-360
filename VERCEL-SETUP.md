# Vercel Deployment Setup

## 1. Connect Repository
- Go to [vercel.com/new](https://vercel.com/new)
- Connect your GitHub repository
- Select framework: **Other** (or Vite)

## 2. Environment Variables
In Vercel project settings → Environment Variables, add:

```
VITE_SUPABASE_URL=https://xphdiimaypwsugxbrsgk.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_7Hrju3KH7YblmJsDHtEu1g_RH4PZMup
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
VITE_APP_URL=https://your-domain.vercel.app
```

**Replace:**
- `VITE_GEMINI_API_KEY` with your actual Gemini API key
- `your-domain.vercel.app` with your actual Vercel domain

## 3. Build Settings
```
Build Command: npm run build
Output Directory: dist
```

## 4. Deploy
Click **Deploy** → Wait for build to complete

## 5. Verify
1. Open your Vercel URL
2. Login with demo credentials
3. Try creating: Client → Store → POS Machine
4. If errors, check:
   - Vercel Build Logs (Deployments tab)
   - Browser Console (F12)
   - Supabase SQL Editor (check data)

## Troubleshooting

**Build fails:**
- Check build logs in Vercel dashboard
- Ensure all .ts/.tsx files are valid TypeScript

**App crashes on load:**
- Check browser console (F12)
- Verify env variables are set correctly in Vercel

**RLS Policy Errors:**
- Execute `supabase-rls-policies.sql` in Supabase SQL Editor
- Verify all policies are enabled

**Supabase Connection Errors:**
- Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel
- Check Supabase project is active
