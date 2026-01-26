from utils.gemini_client import GeminiClient
from utils.opik_logger import OpikLogger

class WorkoutOrchestratorAgent:
    def __init__(self):
        # Use Flash for complex multi-constraint reasoning
        self.gemini = GeminiClient(model_name="gemini-2.0-flash")
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
        
        if response['success']:
            # Validate no constraint violations
            violations = self._check_constraints(
                response['response'],
                medical_constraints
            )
            
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
                    'safe_workout': len(violations) == 0
                }
            )
            
            # Log constraint check
            self.opik.log_constraint_check(
                constraints_satisfied=True if len(violations) == 0 else False,
                violations=violations
            )
        
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