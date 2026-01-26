cat > README.md << 'EOF'
# 🏥 HealthFlow AI - Medical Recovery Intelligence System

AI-powered adaptive fitness and nutrition for post-surgical patients and chronic disease management.

## 🎯 Problem
60% of post-surgical patients re-injure themselves. Existing fitness apps can't read medical restrictions, monitor recovery biomarkers, or prevent medication-food interactions.

## 🚀 Solution
Multi-agent AI system that:
- Reads medical documents and extracts constraints
- Monitors HRV/biometrics for recovery state
- Generates medically-safe, adaptive workouts
- Checks meals for medication interactions
- Logs all decisions to Opik for evaluation

## 🏗️ Architecture
```
Medical Parser Agent → Extracts constraints
         ↓
HRV Monitor Agent → Assesses recovery capacity
         ↓
Nutrition Advisor → Checks meal safety
         ↓
Workout Orchestrator → Generates adaptive plan
         ↓
Opik → Tracks decisions & outcomes
```

## 🛠️ Tech Stack
- **Backend**: Python, Flask, Google Gemini API
- **Frontend**: React, TypeScript, Vite
- **Observability**: Opik
- **AI**: Multi-agent system with Gemini 2.0

## 📦 Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
python main.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🎯 Demo
- **Live Demo**: [Coming Soon]
- **Video**: [Coming Soon]

## 📊 Hackathon Submission
- **Checkpoint**: 2
- **Features**: Multi-agent orchestration, medical constraint extraction, HRV monitoring, medication interaction detection

## 📝 License
MIT

## 👤 Author
Harsh Dubey
EOF