# HealthFlow AI - Vercel Deployment Guide

This guide will help you deploy the complete HealthFlow AI application (frontend + backend) to Vercel.

## Prerequisites

- Vercel account (free tier works)
- GitHub repository with your code
- API keys ready:
  - Gemini API key from https://aistudio.google.com/apikey
  - Opik API key from https://www.comet.com/opik

## Architecture

The project has been restructured for serverless deployment:

```
/
├── frontend/           # React + Vite frontend
│   ├── src/
│   └── dist/          # Built static files
├── api/               # Python serverless functions
│   ├── orchestrate.py      # Main workflow orchestration
│   ├── hrv-analyze.py      # HRV analysis endpoint
│   ├── medical-parse.py    # Medical constraint parsing
│   ├── nutrition-check.py  # Nutrition & interactions
│   ├── workout-generate.py # Workout generation
│   └── lib/                # Shared agent code
│       ├── agents/
│       ├── utils/
│       └── data/
├── vercel.json        # Vercel configuration
└── requirements.txt   # Python dependencies
```

## Deployment Steps

### 1. Push to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Import Project to Vercel

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select your GitHub repository
4. Vercel will auto-detect the configuration from `vercel.json`

### 3. Configure Environment Variables

In the Vercel dashboard, add these environment variables:

**Required:**
- `GEMINI_API_KEY` - Your Google Gemini API key
- `OPIK_API_KEY` - Your Opik API key

**Optional (pre-configured in vercel.json):**
- `OPIK_URL_OVERRIDE` - Already set to `https://www.comet.com/opik/api`
- `OPIK_WORKSPACE` - Already set to `default`
- `OPIK_PROJECT_NAME` - Already set to `healthflow-ai`

**How to add:**
1. Go to your project settings
2. Click "Environment Variables"
3. Add each variable for all environments (Production, Preview, Development)

### 4. Deploy

Click "Deploy" and wait 2-3 minutes for:
- Frontend build (Vite)
- Python serverless functions setup
- Deployment to CDN

### 5. Test Deployment

Once deployed, visit your Vercel URL (e.g., `healthflow-ai.vercel.app`):

1. **Test Frontend:** You should see the phone mockup interface
2. **Test API:** Try generating a workout
3. **Check Opik:** Visit https://www.comet.com/opik to see logged traces

## Serverless Function Endpoints

Your API functions will be available at:

- `https://your-app.vercel.app/api/orchestrate` - Full workflow
- `https://your-app.vercel.app/api/hrv-analyze` - HRV analysis
- `https://your-app.vercel.app/api/medical-parse` - Medical parsing
- `https://your-app.vercel.app/api/nutrition-check` - Nutrition check
- `https://your-app.vercel.app/api/workout-generate` - Workout generation

## Limitations & Considerations

### Vercel Free Tier Limits:
- **10-second timeout** per function (should be fine for your agents)
- **Cold starts:** 1-3 second delay on first request
- **1000 serverless invocations/day** (generous for demo/hackathon)

### Performance Tips:
- Functions stay "warm" for ~5 minutes after use
- First request after cold start will be slower
- Subsequent requests are fast (~200-500ms)

### Cost Optimization:
- Gemini Flash-Lite: 1000 requests/day free
- Opik: Unlimited free tier for hackathons
- Vercel: Free hobby plan sufficient

## Troubleshooting

### Issue: "Module not found" errors

**Solution:** Check that `api/lib/` has all necessary files:
```bash
ls api/lib/
# Should show: agents/ utils/ data/ __init__.py
```

### Issue: API calls failing with CORS errors

**Solution:** CORS is handled in each serverless function. Check browser console for specific error.

### Issue: Functions timing out

**Solution:**
- Gemini API might be slow
- Fallback logic should kick in automatically
- Check function logs in Vercel dashboard

### Issue: Environment variables not working

**Solution:**
1. Verify variables are set in Vercel dashboard
2. Make sure they're enabled for "Production" environment
3. Redeploy after adding variables

## Local Development

To test locally after restructuring:

```bash
# Install Vercel CLI
npm i -g vercel

# Run locally
vercel dev
```

This will:
- Start frontend on localhost:3000
- Run serverless functions locally
- Use your local environment variables

## Monitoring & Debugging

### Vercel Dashboard
- View function logs
- Check deployment status
- Monitor performance

### Opik Dashboard
Visit https://www.comet.com/opik to:
- See all agent decisions
- Track multi-agent workflows
- Monitor constraint violations
- Debug failed generations

## Next Steps

After successful deployment:

1. **Custom Domain:** Add your own domain in Vercel settings
2. **Analytics:** Enable Vercel Analytics for user insights
3. **Monitoring:** Set up alerts for function failures
4. **Optimization:** Review cold start times and optimize if needed

## Support

If you encounter issues:
1. Check Vercel function logs
2. Review Opik traces for agent failures
3. Verify environment variables are set correctly
4. Check that Gemini API key has billing enabled

---

**Deployment Time:** ~3-5 minutes
**First Cold Start:** ~2-3 seconds
**Subsequent Requests:** ~200-500ms

Good luck with your deployment! 🚀
