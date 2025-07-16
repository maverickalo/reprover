# Domain Configuration - Option 1

## Setup: reprover.dev → Frontend, www.reprover.dev → Backend

### Step 1: Configure Backend Domain (www.reprover.dev)
1. Go to https://vercel.com/dashboard
2. Click on the **reprover** project (this is your backend)
3. Go to **Settings** → **Domains**
4. Click **Add**
5. Enter `www.reprover.dev`
6. Click **Add** to confirm

### Step 2: Configure Frontend Domain (reprover.dev)
1. Go back to dashboard
2. Click on the **reprover-client** project (this is your frontend)
3. Go to **Settings** → **Domains**
4. Click **Add**
5. Enter `reprover.dev` (without www)
6. Click **Add** to confirm

### Step 3: DNS Configuration
If you own the domain outside of Vercel, add these DNS records at your domain provider:

**For reprover.dev (frontend):**
- Type: A
- Name: @ (or blank)
- Value: 76.76.21.21

**For www.reprover.dev (backend):**
- Type: CNAME
- Name: www
- Value: cname.vercel-dns.com

### Step 4: Wait for DNS Propagation
- This usually takes 5-10 minutes
- Vercel will show green checkmarks when ready

### Step 5: Test Your Setup
Once DNS is ready:
1. Visit https://reprover.dev - Should show your workout app
2. Try parsing a workout - Should work with API at www.reprover.dev

## Current Deployment Status
- Frontend code is updated to use `https://www.reprover.dev` as API
- Ready to deploy once domains are configured

## If You See Errors
- "Domain already in use" - Remove it from the other project first
- "Invalid configuration" - Check DNS records
- API still failing - Hard refresh browser (Ctrl+Shift+R)