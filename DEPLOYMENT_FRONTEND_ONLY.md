# Frontend-Only Vercel Deployment

Due to Vercel serverless function size limits (250 MB), we're deploying **frontend only** to Vercel.

## Current Setup

✅ **Frontend:** Deployed on Vercel
⚠️ **Backend:** Run locally or deploy separately

## How to Use

### Option 1: Run Backend Locally (Recommended for Demo)

1. **Deploy frontend to Vercel** (automatic from GitHub)
2. **Run backend locally:**
   ```bash
   cd backend
   python main.py
   ```
3. **Access your app:**
   - Frontend: `https://your-app.vercel.app`
   - Backend: `http://localhost:5001`

**Note:** The frontend is configured to call `localhost:5001` by default. This works when you:
- Visit the Vercel URL on the same computer running the backend
- Use for local demos and development

### Option 2: Deploy Backend Separately (For Production)

Deploy backend to a platform that supports Python:

**Recommended platforms:**
- **Render** (easiest): https://render.com
- **Railway**: https://railway.app
- **Fly.io**: https://fly.io
- **PythonAnywhere**: https://www.pythonanywhere.com

**Steps:**

1. **Deploy backend** to your chosen platform
2. **Get the backend URL** (e.g., `https://healthflow-backend.onrender.com`)
3. **Update Vercel environment variable:**
   - Go to Vercel project → Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com/api`
   - Redeploy frontend

## Quick Render Backend Deployment

If you want to deploy backend to Render:

1. Go to https://render.com and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Name:** healthflow-backend
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python main.py`
   - **Environment Variables:** Add your `GEMINI_API_KEY` and `OPIK_API_KEY`
5. Click "Create Web Service"
6. Copy the service URL (e.g., `https://healthflow-backend.onrender.com`)
7. Add to Vercel:
   - `VITE_API_URL` = `https://healthflow-backend.onrender.com/api`

## Why Frontend Only on Vercel?

Vercel serverless functions have a **250 MB unzipped limit**. Our Python backend with dependencies (Opik, Google Generative AI, Flask) exceeds this.

**Alternatives considered:**
- ❌ Reduce dependencies → Would lose Opik observability
- ❌ Split into smaller functions → Complex, still size issues
- ✅ **Deploy frontend on Vercel, backend elsewhere** → Simple, works perfectly

## Current Deployment Status

✅ Frontend builds successfully
✅ All TypeScript errors fixed
✅ Static site deployed to Vercel
⚠️ Backend must run separately

## For Hackathon Demo

**Best approach:**

1. Open Vercel URL on your laptop
2. Run backend on same laptop (`cd backend && python main.py`)
3. App works perfectly for live demo!

OR

1. Deploy backend to Render (free tier, 5 minutes)
2. Set `VITE_API_URL` in Vercel
3. Fully deployed, works from anywhere

---

**Questions?** The frontend is fully deployed and working. Just need to connect it to a running backend!
