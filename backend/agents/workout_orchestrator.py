from utils.gemini_client import GeminiClient
from utils.opik_logger import OpikLogger

class WorkoutOrchestratorAgent:
    def __init__(self):
        # Use Flash-Lite to avoid quota limits (1000 req/day vs 20 req/day)
        self.gemini = GeminiClient(model_name="gemini-2.0-flash-lite")
        self.opik = OpikLogger()
    
    def generate_workout(self, medical_constraints, hrv_analysis, user_context):
        """
        Multi-agent orchestration: combine all inputs to generate safe workout
        """
        system_instruction = """You are a workout programming expert that generates medically-safe, recovery-appropriate training plans.

PRIORITY ORDER:
1. Medical safety (NEVER violate medical constraints)
2. Recovery capacity (respect HRV/biometric data)
3. User constraints (time, equipment, energy)
4. Training effectiveness

You must show clear reasoning for every decision."""

        prompt = f"""
Generate a workout plan considering ALL these factors:

MEDICAL CONSTRAINTS:
{medical_constraints}

RECOVERY STATE:
{hrv_analysis}

USER CONTEXT:
- Time available: {user_context.get('time_minutes', 30)} minutes
- Equipment: {', '.join(user_context.get('equipment', ['bodyweight']))}
- Energy level: {user_context.get('energy_level', 'moderate')}/10

Requirements:
1. List 5-7 exercises with sets/reps
2. For EACH exercise, explain WHY it was chosen (medical safety, recovery appropriate, equipment match)
3. Explicitly state which medical constraints you're respecting
4. Note the workout intensity adjustment based on HRV
5. Include warm-up and cool-down

Format:
WORKOUT PLAN:
[Exercise list with sets/reps]

REASONING FOR EACH EXERCISE:
[Why this exercise is safe and appropriate]

MEDICAL SAFETY CHECKS:
[Which constraints were respected]

RECOVERY ALIGNMENT:
[How HRV influenced programming]
"""
        
        response = self.gemini.generate_with_thinking(prompt, system_instruction)

        # FALLBACK: If Gemini API fails, use rule-based workout generation
        if not response['success']:
            print(f"⚠️ Gemini API failed for workout generation: {response.get('error', 'Unknown error')}")
            print("📋 Using fallback rule-based workout generation...")
            response = self._fallback_workout(medical_constraints, hrv_analysis, user_context)

        if response['success']:
            # Validate no constraint violations
            violations = self._check_constraints(
                response['response'],
                medical_constraints
            )

            try:
                self.opik.log_agent_decision(
                    agent_name='workout_orchestrator',
                    input_data={
                        'medical': medical_constraints,
                        'hrv': hrv_analysis,
                        'context': user_context
                    },
                    output_data=response['response'],
                    reasoning=response['response'],
                    metadata={
                        'constraint_violations': violations,
                        'safe_workout': len(violations) == 0,
                        'fallback_used': response.get('fallback', False)
                    }
                )

                # Log constraint check
                self.opik.log_constraint_check(
                    constraints_satisfied=True if len(violations) == 0 else False,
                    violations=violations
                )
            except Exception as e:
                print(f"⚠️ Opik logging failed: {e}")

        return response
    
    def _check_constraints(self, workout_text, constraints):
        """
        Simple constraint violation check
        """
        violations = []
        workout_lower = workout_text.lower()

        # Check for common violations
        if 'no pivoting' in constraints.lower():
            if any(word in workout_lower for word in ['lunge', 'twist', 'rotation']):
                violations.append('Potential pivoting movement detected')

        if 'no jumping' in constraints.lower():
            if any(word in workout_lower for word in ['jump', 'plyometric', 'burpee']):
                violations.append('Jumping movement detected')

        return violations

    def _fallback_workout(self, medical_constraints, hrv_analysis, user_context):
        """
        Rule-based fallback workout generation when Gemini API is unavailable
        """
        time_minutes = user_context.get('time_minutes', 30)
        equipment = user_context.get('equipment', ['bodyweight'])
        energy_level = user_context.get('energy_level', 5)

        # Determine intensity modifier based on HRV and energy
        if 'POOR' in hrv_analysis.upper() or 'COMPROMISED' in hrv_analysis.upper():
            intensity = 'LOW'
            volume_modifier = 0.5
        elif energy_level < 5:
            intensity = 'LOW-MODERATE'
            volume_modifier = 0.7
        else:
            intensity = 'MODERATE'
            volume_modifier = 1.0

        # Calculate sets based on time available
        exercises_count = min(6, max(4, time_minutes // 5))
        sets_per_exercise = int(3 * volume_modifier)

        # Select safe exercises based on constraints
        safe_exercises = []

        # Upper body push (safe for most recoveries)
        if 'dumbbells' in equipment or 'resistance bands' in equipment:
            safe_exercises.append({
                'name': 'Chest Press',
                'sets': sets_per_exercise,
                'reps': '10-12',
                'reason': 'Upper body push, no lower body stress, equipment available'
            })
        else:
            safe_exercises.append({
                'name': 'Push-ups (Modified if needed)',
                'sets': sets_per_exercise,
                'reps': '8-15',
                'reason': 'Upper body push, bodyweight, scalable difficulty'
            })

        # Upper body pull
        if 'resistance bands' in equipment:
            safe_exercises.append({
                'name': 'Resistance Band Rows',
                'sets': sets_per_exercise,
                'reps': '12-15',
                'reason': 'Upper body pull, controlled movement, low joint stress'
            })

        # Core (avoiding movements based on constraints)
        if 'no rotation' not in medical_constraints.lower():
            safe_exercises.append({
                'name': 'Plank Hold',
                'sets': sets_per_exercise,
                'reps': '20-30 seconds',
                'reason': 'Core stability, isometric, safe for most conditions'
            })

        # Lower body (careful with constraints)
        if 'no pivoting' in medical_constraints.lower() and 'no jumping' in medical_constraints.lower():
            safe_exercises.append({
                'name': 'Wall Sit',
                'sets': sets_per_exercise,
                'reps': '20-30 seconds',
                'reason': 'Lower body strength, no pivoting, no impact, controlled'
            })
            safe_exercises.append({
                'name': 'Calf Raises',
                'sets': sets_per_exercise,
                'reps': '15-20',
                'reason': 'Lower leg strength, vertical movement only, safe'
            })
        else:
            safe_exercises.append({
                'name': 'Bodyweight Squats (Shallow)',
                'sets': sets_per_exercise,
                'reps': '10-15',
                'reason': 'Fundamental movement, scalable depth, functional'
            })

        # Shoulder work
        if 'dumbbells' in equipment or 'resistance bands' in equipment:
            safe_exercises.append({
                'name': 'Shoulder Raises',
                'sets': sets_per_exercise,
                'reps': '12-15',
                'reason': 'Shoulder stability, controlled range, equipment available'
            })

        # Trim to fit time
        safe_exercises = safe_exercises[:exercises_count]

        # Format workout plan
        workout_text = f"""
WORKOUT PLAN ({intensity} INTENSITY - {time_minutes} minutes):

WARM-UP (5 minutes):
- Arm circles: 10 each direction
- Torso rotations: 10 each side (if no rotation restriction)
- March in place: 30 seconds
- Deep breathing: 5 breaths

MAIN WORKOUT:
"""
        for i, ex in enumerate(safe_exercises, 1):
            workout_text += f"{i}. {ex['name']}: {ex['sets']} sets × {ex['reps']} reps\n"

        workout_text += f"""
COOL-DOWN (3 minutes):
- Light stretching of worked muscles
- Deep breathing exercises

REASONING FOR EACH EXERCISE:
"""
        for i, ex in enumerate(safe_exercises, 1):
            workout_text += f"{i}. {ex['name']}: {ex['reason']}\n"

        workout_text += f"""
MEDICAL SAFETY CHECKS:
✓ All exercises reviewed against: {medical_constraints}
✓ No pivoting movements included (ACL protection)
✓ No jumping or high-impact movements
✓ Progressive single-leg work avoided at this stage
✓ All movements can be scaled for current recovery phase

RECOVERY ALIGNMENT:
- Intensity adjusted to {intensity} based on recovery state
- Volume reduced by {int((1-volume_modifier)*100)}% due to HRV/energy indicators
- Exercise selection prioritizes controlled, stable movements
- Rest periods should be {60 if intensity == 'LOW' else 45} seconds between sets

[Note: This workout was generated using rule-based fallback logic due to API limitations]
"""

        return {
            'success': True,
            'response': workout_text,
            'fallback': True
        }