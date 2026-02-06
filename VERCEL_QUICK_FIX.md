# Vercel Deployment Quick Fix

## What Was Wrong

Your vercel.json had conflicting configurations that prevented the build from finding the `vite` command.

## What Was Fixed

1. **Simplified vercel.json** - Removed legacy `builds` array and conflicting commands
2. **Added vercel-build script** to frontend/package.json
3. **Updated deployment instructions** in DEPLOYMENT.md

## Next Steps

### 1. Commit and Push Changes

```bash
git add .
git commit -m "Fix Vercel deployment configuration"
git push origin main
```

### 2. Redeploy on Vercel

Vercel will automatically trigger a new deployment when you push. If not:

1. Go to your Vercel dashboard
2. Click "Deployments" tab
3. Click "Redeploy" on the latest deployment

### 3. Add Environment Variables (IMPORTANT!)

Before the deployment will work, add these environment variables in Vercel:

**Go to: Settings → Environment Variables**

Add these 5 variables:

| Variable Name | Value |
|---------------|-------|
| `GEMINI_API_KEY` | `AIzaSyDXe3k7nkapbgVQOQTyzNIWcrLxSHxBJoI` |
| `OPIK_API_KEY` | `8RPZJ1xfYAvywYfoudF96Oyr6` |
| `OPIK_URL_OVERRIDE` | `https://www.comet.com/opik/api` |
| `OPIK_WORKSPACE` | `default` |
| `OPIK_PROJECT_NAME` | `healthflow-ai` |

**For each variable:**
- Click "Add New"
- Enter name and value
- Select **all** environments (Production, Preview, Development)
- Click Save

### 4. Trigger Redeploy After Adding Variables

After adding environment variables:
1. Go to "Deployments" tab
2. Click "..." menu on latest deployment
3. Click "Redeploy"

## Expected Build Output

You should see:
```
✓ Installing dependencies (frontend)
✓ Building frontend (TypeScript + Vite)
✓ Deploying Python serverless functions
✓ Deployment complete!
```

## If Build Still Fails

### Check Build Logs

Look for these specific errors:

**"vite: command not found"**
- Solution: Make sure you pushed the latest changes

**"Module not found: api/lib"**
- Solution: Verify `api/lib/` directory exists with agents, utils, data folders

**"Environment variable not found"**
- Solution: Add all 5 environment variables in Vercel dashboard

### Test Locally First

```bash
cd frontend
npm install
npm run build
```

If this works locally, it should work on Vercel.

## Deployment Time

- **First build:** ~2-3 minutes
- **Subsequent builds:** ~1-2 minutes (with cache)

## After Successful Deployment

Your app will be live at: `https://[your-project-name].vercel.app`

Test these URLs:
- `/` - Frontend (phone mockup)
- `/api/orchestrate` - Backend API (should return error without POST data, but confirms it's running)

## Still Having Issues?

Check:
1. ✅ Latest code is pushed to GitHub
2. ✅ All 5 environment variables are added in Vercel
3. ✅ Build logs show frontend building successfully
4. ✅ API folder structure: `/api/*.py` and `/api/lib/`

---

**Quick Command Summary:**

```bash
# Commit fixes
git add .
git commit -m "Fix Vercel deployment"
git push origin main

# Then add environment variables in Vercel dashboard
# Then click "Redeploy" in Vercel
```

You should be live in ~3 minutes! 🚀
