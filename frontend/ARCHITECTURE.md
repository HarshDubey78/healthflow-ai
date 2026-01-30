# HealthFlow AI - Frontend Architecture

## Overview

The HealthFlow AI frontend has been completely redesigned with two distinct user journeys:

1. **New User Journey**: 5-step onboarding flow
2. **Existing User Journey**: Daily-use app with tab navigation

## Architecture Components

### 1. Storage Layer (`utils/storage.ts`)

Handles all client-side data persistence using localStorage:

- **UserProfile**: Stores user information, medical history, goals, equipment
- **HRVData**: Tracks daily HRV measurements and recovery scores
- **WorkoutHistory**: Records completed workouts
- **Streak Tracking**: Maintains consecutive workout days

### 2. Orchestrator (`utils/orchestrator.ts`)

The orchestrator bridges the new UI with your existing backend multi-agent system. It connects to:

- **HRV Analysis Agent** (`POST /api/hrv/analyze`)
- **Medical Parser Agent** (`POST /api/medical/parse`)
- **Workout Orchestrator Agent** (`POST /api/workout/generate`)
- **Nutrition Advisor Agent** (`POST /api/nutrition/check`)

#### Example Usage:

```typescript
import { orchestrator } from './utils/orchestrator'

// Generate a complete workout plan
const result = await orchestrator.generateDailyWorkout({
  hrv_ms: 65,
  baseline_hrv: 65,
  resting_hr: 60,
  baseline_resting_hr: 60,
  sleep_hours: 7,
  baseline_sleep: 7,
  surgery: 'ACL reconstruction',
  restrictions: ['no jumping', 'no pivoting'],
  medications: ['ibuprofen'],
  equipment: ['resistance bands', 'yoga mat'],
  time_available: 30,
  goals: ['strength building']
})
```

### 3. UI Components (`components/ui/`)

Reusable components used across all screens:

- **Card**: Container with optional hover effects
- **StatusBadge**: Recovery status indicators (optimal/good/moderate/poor)
- **BottomSheet**: Modal sheets for forms and content
- **TabNavigation**: Fixed bottom navigation (Home, Progress, Nutrition, Settings)
- **HRVTrendGraph**: SVG line chart for HRV visualization

### 4. Main Screens (`screens/`)

#### Onboarding (`screens/Onboarding.tsx`)
5-step wizard for new users:
1. Welcome screen with benefits
2. Medical profile (surgery, restrictions, medications)
3. Goals & equipment selection
4. Baseline biometrics
5. Summary & confirmation

Saves complete profile to localStorage and generates initial HRV data.

#### DailyHome (`screens/DailyHome.tsx`)
Main screen for existing users:
- Personalized greeting & streak counter
- Today's HRV with recovery status
- 7-day HRV trend graph
- Workout generation (connected to backend via orchestrator)
- Quick actions (meal logging, feeling check)
- Recent activity feed

#### Progress (`screens/Progress.tsx`)
Analytics and tracking:
- Timeframe selector (7/30 days)
- Stats overview (streak, workouts, minutes, avg HRV)
- HRV trend with min/max/average
- Recovery distribution
- Workout summary by type
- Achievement milestones

#### Settings (`screens/Settings.tsx`)
Profile management:
- Edit personal information
- Edit medical profile
- Edit fitness goals & equipment
- Edit baseline biometrics
- Reset all data

## User Flow

### New User (First Time)
```
App Start → Check localStorage
  ↓ (no profile found)
Onboarding Screen (5 steps)
  ↓ (saves profile)
DailyHome Screen (main app)
```

### Existing User (Returning)
```
App Start → Check localStorage
  ↓ (profile exists)
DailyHome Screen
  ↓ (tab navigation)
Progress / Nutrition / Settings
```

## Backend Integration

The orchestrator communicates with your Flask backend running on `http://localhost:5001/api`:

### Expected Endpoints

1. **POST /api/hrv/analyze**
   ```json
   {
     "hrv_ms": 65,
     "baseline_hrv": 65,
     "resting_hr": 60,
     "baseline_resting_hr": 60,
     "sleep_hours": 7,
     "baseline_sleep": 7
   }
   ```

2. **POST /api/medical/parse**
   ```json
   {
     "surgery": "ACL reconstruction",
     "restrictions": ["no jumping"],
     "medications": ["ibuprofen"]
   }
   ```

3. **POST /api/workout/generate**
   ```json
   {
     "hrv_analysis": "...",
     "medical_constraints": "...",
     "equipment": ["resistance bands"],
     "time_available": 30,
     "goals": ["strength"]
   }
   ```

4. **POST /api/nutrition/check**
   ```json
   {
     "medications": ["warfarin"],
     "recent_meals": ["spinach salad"]
   }
   ```

## Design Philosophy

### Web-Optimized Layout
- Max-width containers (1200-1400px)
- Desktop-first responsive design
- Grid layouts for larger screens
- Centered content for better readability

### Mobile Support
- Responsive breakpoints
- Touch-friendly buttons
- Bottom sheet modals
- Tab navigation for one-handed use

## Running the App

1. **Start Backend** (port 5001):
   ```bash
   cd backend
   python main.py
   ```

2. **Start Frontend** (port 5173):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access**:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5001

## Future Enhancements

- [ ] Real wearable integration (Apple Health, Google Fit)
- [ ] Push notifications for workout reminders
- [ ] Social features (share progress)
- [ ] Export workout history to PDF
- [ ] Voice logging for workouts
- [ ] Offline mode with sync
