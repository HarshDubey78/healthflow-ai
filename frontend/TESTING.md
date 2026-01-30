# Testing Guide - HealthFlow AI Frontend

## Quick Test Steps

### 1. Start the Application

```bash
cd frontend
npm run dev
```

Open browser to: http://localhost:5173

### 2. Test Flow for New Users

**Step 1: Landing Page**
- You should see the marketing landing page with "Start Your Recovery Journey" button
- Click the button

**Step 2: Onboarding (5 Steps)**

1. **Welcome Screen**: Shows benefits, click "Continue"

2. **Medical Profile**:
   - Enter surgery type: "ACL reconstruction"
   - Select surgery date
   - Add restrictions: "no jumping, no pivoting"
   - Add medications: "ibuprofen" (optional)
   - Click "Continue"

3. **Goals & Equipment**:
   - Select recovery goals (can select multiple): "Strength Building", "Return to Sports"
   - Select available equipment: "resistance bands", "yoga mat"
   - Set time available: 30 minutes
   - Click "Continue"

4. **Baseline Biometrics**:
   - Shows simulated baseline values (HRV: 65ms, HR: 62bpm, Sleep: 7.5hr)
   - Click "Continue"

5. **Summary**:
   - Review all entered information
   - Click "Start My Recovery Journey →"

**Expected Result**: You should be redirected to the DailyHome screen

### 3. Test Main App Screens

**DailyHome Tab** (should load automatically)
- Check greeting shows your name
- Verify HRV card displays recovery status
- Verify 7-day HRV trend graph renders
- Click "Generate Today's Workout" button
  - **Note**: This requires backend running on port 5001
  - If backend is offline, you'll see an error message
  - If backend is running, workout plan should appear in a modal

**Progress Tab**
- Click Progress icon in bottom navigation
- Verify stats grid shows (streak, workouts, minutes, avg HRV)
- Switch between "7 Days" and "30 Days" timeframe
- Check if HRV trend graph updates

**Nutrition Tab**
- Click Nutrition icon
- This loads the existing NutritionCheck component
- Test medication-food interaction checking

**Settings Tab**
- Click Settings icon
- Try editing different profile sections:
  - Personal Information
  - Medical Profile
  - Fitness Profile
  - Baseline Biometrics
- Test "Reset All Data" button (warning: clears everything!)

### 4. Test Workout Generation (Backend Integration)

**Prerequisites**: Backend must be running on http://localhost:5001

```bash
# In a separate terminal
cd backend
python main.py
```

**Test Steps**:
1. Go to DailyHome tab
2. Click "Generate Today's Workout" button
3. Wait for "Generating..." state
4. Workout plan should appear in modal
5. Click "Close" to dismiss

**What Happens Behind the Scenes**:
- Orchestrator calls HRV Analysis Agent with your HRV data
- Orchestrator calls Medical Parser Agent with your medical profile
- Orchestrator calls Workout Orchestrator Agent with combined analysis
- Workout plan is returned and displayed

### 5. Test Data Persistence

**Test localStorage**:
1. Complete onboarding
2. Refresh the page (F5)
3. **Expected**: Should load directly to DailyHome (skip landing & onboarding)

**View Stored Data**:
Open browser DevTools → Application → Local Storage → http://localhost:5173
- Check for keys: `healthflow_user_profile`, `healthflow_hrv_history`

### 6. Test Reset Flow

1. Go to Settings tab
2. Click "Reset All Data"
3. Confirm reset
4. **Expected**: Should return to landing page
5. Complete onboarding again

## Debugging

### Check Browser Console

Open DevTools (F12) → Console tab

Look for these debug logs:
```
Completing onboarding with profile: {...}
Saving profile: {...}
Onboarding complete, calling onComplete callback
App: Onboarding completed, switching to app state
```

### Common Issues

**Issue**: Stuck on onboarding, button doesn't work
- Check console for errors
- Verify all required fields are filled
- Check if localStorage is blocked (private browsing)

**Issue**: Workout generation fails
- Verify backend is running: http://localhost:5001
- Check backend logs for errors
- Open Network tab in DevTools to see API calls

**Issue**: Landing page doesn't show
- Clear localStorage
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## Testing Checklist

- [ ] Landing page loads correctly
- [ ] Onboarding Step 1: Welcome screen
- [ ] Onboarding Step 2: Medical profile saves
- [ ] Onboarding Step 3: Goals & equipment selection works
- [ ] Onboarding Step 4: Biometrics display
- [ ] Onboarding Step 5: Summary shows all data
- [ ] "Start My Recovery Journey" button completes onboarding
- [ ] DailyHome loads with HRV data
- [ ] HRV trend graph renders
- [ ] Progress screen shows stats
- [ ] Settings allows editing
- [ ] Reset data returns to landing
- [ ] Workout generation connects to backend (if running)
- [ ] Data persists after refresh
