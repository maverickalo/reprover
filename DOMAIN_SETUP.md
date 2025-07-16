# Domain Setup Instructions for reprover.dev

## Quick Steps to Make reprover.dev Show Your App

### 1. Go to Vercel Dashboard
Visit: https://vercel.com/dashboard

### 2. Find Your Frontend Project
- Look for `reprover-client` in your projects list
- Click on it to open the project

### 3. Add Domain
- Click on "Settings" tab
- Click on "Domains" in the left sidebar
- Click "Add" button
- Type `reprover.dev` and click "Add"

### 4. Configure DNS (if needed)
Vercel will show you one of these options:

**Option A - If you bought domain through Vercel:**
- It should work automatically!

**Option B - If you bought domain elsewhere:**
Add these DNS records at your domain provider:
- Type: A
- Name: @ (or leave blank)
- Value: 76.76.21.21

### 5. Wait for DNS (5-10 minutes)
- DNS changes take a few minutes to propagate
- Vercel will show a checkmark when ready

### 6. Update Backend API Domain
Since the frontend will be at reprover.dev, we need the backend somewhere else:

**Option 1 - Use Vercel subdomain (Easiest)**
- Keep using: https://reprover-oemjx3f9a-sean-vernons-projects-31ef7fc1.vercel.app
- No changes needed!

**Option 2 - Use api.reprover.dev (Requires DNS setup)**
- Go to the `reprover` project in Vercel
- Add `api.reprover.dev` as a domain
- Add CNAME record: `api` → `cname.vercel-dns.com`
- Update `src/api/api.ts` to use `https://api.reprover.dev`

## Current Status
- Frontend: https://reprover-client-g3q53yg8e-sean-vernons-projects-31ef7fc1.vercel.app
- Backend: https://reprover-oemjx3f9a-sean-vernons-projects-31ef7fc1.vercel.app
- Target: reprover.dev → Frontend

## Test Your Domain
Once setup is complete, visit:
- https://reprover.dev (your app)
- Try parsing a workout to ensure API works

## Troubleshooting
- If you see "Domain not found", wait 5 more minutes
- If you see the wrong site, check which project has the domain
- If API calls fail, check the API_BASE_URL in src/api/api.ts