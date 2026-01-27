# HealthFlow AI - API Configuration

## Gemini Models Used

All agents now use **`gemini-2.0-flash-lite`** to maximize daily request quota.

| Agent | Model | Daily Quota | Purpose |
|-------|-------|-------------|---------|
| HRV Monitor | gemini-2.0-flash-lite | 1,000 requests | Recovery analysis |
| Medical Parser | gemini-2.0-flash-lite | 1,000 requests | Medical constraint extraction |
| Nutrition Advisor | gemini-2.0-flash-lite | 1,000 requests | Meal analysis & drug interactions |
| Workout Orchestrator | gemini-2.0-flash-lite | 1,000 requests | Workout plan generation |

### Why Flash-Lite?

- **High quota**: 1,000 requests/day vs 20 requests/day for Flash
- **Fast responses**: Optimized for speed
- **Caching**: Reduces API calls by ~80% for repeated requests
- **Retry logic**: Automatic retry with exponential backoff on rate limits

## Rate Limiting Strategy

### 1. Caching (Primary)
- All API responses cached for 24 hours
- Cache location: `backend/.cache/`
- Reduces API calls by 80%+ in typical usage

### 2. Retry Logic
- 3 retry attempts on rate limit errors
- Exponential backoff: 2s, 4s, 8s
- Helpful error messages

### 3. Fallback Mechanisms
All agents have rule-based fallbacks when API fails:

- **HRV Monitor**: Uses HRV deviation thresholds
- **Workout Orchestrator**: Generates safe workouts based on constraints
- **Nutrition Advisor**: Provides basic guidance and interaction warnings
- **Medical Parser**: (Gemini-dependent, no fallback yet)

## Current API Status

Check your API usage at: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

### Expected Daily Usage (without cache)
- Development/Testing: 20-50 requests
- Demo: 10-20 requests
- With cache: 5-10 requests (first run higher)

## Troubleshooting

### "Too many requests" error
1. Check cache is enabled (should see `✅ Cache hit` messages)
2. Wait 24 hours for quota reset
3. Fallback logic will activate automatically

### Cache not working
1. Check `backend/.cache/` directory exists
2. Verify write permissions
3. Clear cache: `rm -rf backend/.cache/*`

### Opik logging errors
- Opik is optional - app works fine without it
- Configure in `backend/.env`:
  ```
  OPIK_API_KEY=your_key
  OPIK_WORKSPACE=your_workspace
  ```
- If not configured, you'll see: `📋 Opik not configured - skipping observability logging`

## Performance Metrics

### With Caching (after first run):
- HRV Check: ~100ms (cache hit)
- Medical Profile: ~500ms (partial cache)
- Workout Generation: ~200ms (cache hit)
- Nutrition Analysis: ~150ms (cache hit)

### Without Cache (first run):
- HRV Check: ~2-3s
- Medical Profile: ~3-4s
- Workout Generation: ~4-5s
- Nutrition Analysis: ~2-3s

## Cost Estimation

Gemini 2.0 Flash-Lite is **FREE** with the following limits:
- 1,000 requests per day
- Up to 1M tokens per request
- No credit card required

For production use, consider:
- Google AI Studio (Pay-as-you-go)
- Vertex AI (Enterprise)
