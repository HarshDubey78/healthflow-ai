from utils.gemini_client import GeminiClient
from utils.opik_logger import OpikLogger

class MedicalParserAgent:
    def __init__(self):
        self.gemini = GeminiClient(model_name="gemini-2.0-flash-lite")
        self.opik = OpikLogger()
    
    def extract_constraints(self, medical_profile):
        """
        Extract actionable workout constraints from medical profile
        """
        system_instruction = """You are a medical constraint analyzer for fitness programming. 
Extract specific, actionable workout restrictions from medical information.

Focus on:
- Movement restrictions (what to avoid)
- Allowed progressions (what's safe now)
- Contraindicated exercises (specific movements to block)
- Recovery timeline considerations"""

        prompt = f"""
Medical Profile:
- Surgery: {medical_profile.get('surgery', 'None')}
- Weeks Post-Op: {medical_profile.get('weeks_post_op', 'N/A')}
- Restrictions: {', '.join(medical_profile.get('restrictions', []))}
- Medications: {', '.join(medical_profile.get('medications', []))}

Extract:
1. Specific exercises/movements to AVOID
2. Exercises/movements that ARE SAFE
3. Progression guidelines (when can they advance)
4. Any medication-related exercise considerations

Format as clear rules for workout programming.
"""
        
        response = self.gemini.generate_with_thinking(prompt, system_instruction)
        
        # FALLBACK: If Gemini API fails
        if not response['success']:
            print(f"⚠️ Gemini API failed: {response.get('error', 'Unknown error')}")
            print("📋 Using fallback medical constraint extraction...")
            response = self._fallback_extraction(medical_profile)
        
        if response['success']:
            try:
                self.opik.log_agent_decision(
                    agent_name='medical_parser',
                    input_data=medical_profile,
                    output_data=response['response'],
                    reasoning=response['response'],
                    metadata={
                        'surgery_type': medical_profile.get('surgery'),
                        'weeks_post_op': medical_profile.get('weeks_post_op'),
                        'fallback_used': response.get('fallback', False)
                    }
                )
            except Exception as e:
                print(f"⚠️ Opik logging failed: {e}")
        
        return response
    
    def _fallback_extraction(self, medical_profile):
        """
        Rule-based fallback for medical constraint extraction
        """
        surgery = medical_profile.get('surgery', '')
        weeks = medical_profile.get('weeks_post_op', 0)
        restrictions = medical_profile.get('restrictions', [])
        medications = medical_profile.get('medications', [])
        
        analysis = f"""
MEDICAL CONSTRAINT ANALYSIS
Surgery: {surgery}
Timeline: Week {weeks} post-operation

REASONING:
Based on standard post-surgical protocols for {surgery} at {weeks} weeks:

MOVEMENTS TO AVOID:
"""
        
        # ACL-specific rules
        if 'ACL' in surgery.upper():
            if weeks < 6:
                analysis += "• NO running, jumping, or pivoting movements\n• NO deep squats (below 90°)\n• NO lateral movements\n"
            elif weeks < 12:
                analysis += "• Avoid pivoting/twisting movements\n• No jumping/plyometrics\n• Limit deep squats\n"
            else:
                analysis += "• Can progress to sport-specific movements with clearance\n• Monitor for any instability\n"
        
        # Add restriction-based rules
        for restriction in restrictions:
            if 'pivot' in restriction.lower():
                analysis += "• No rotational exercises (Russian twists, wood chops)\n• No lateral lunges or side-to-side movements\n"
            if 'jump' in restriction.lower():
                analysis += "• No plyometric exercises\n• No box jumps, burpees, or jump squats\n"
        
        analysis += "\nSAFE EXERCISES:\n"
        
        if 'ACL' in surgery.upper() and weeks >= 8:
            analysis += "• Upper body exercises (all variations)\n"
            analysis += "• Core stability work (planks, dead bugs, bird dogs)\n"
            analysis += "• Controlled lower body: leg press, hamstring curls, quad extensions\n"
            analysis += "• Single-leg balance work (static, no movement)\n"
        else:
            analysis += "• Upper body training (push, pull, press movements)\n"
            analysis += "• Core exercises (anti-rotation focus)\n"
            analysis += "• Cardio: stationary bike, swimming (if cleared)\n"
        
        analysis += f"\nPROGRESSION GUIDELINES:\n"
        analysis += f"• Week {weeks}: Conservative approach, focus on controlled movements\n"
        analysis += f"• Can progress load by 5-10% per week if no pain/swelling\n"
        analysis += f"• Full clearance typically at 6-9 months for return to sport\n"
        
        if medications:
            analysis += f"\nMEDICATION CONSIDERATIONS:\n"
            for med in medications:
                if 'warfarin' in med.lower():
                    analysis += "• Warfarin: Avoid contact sports, minimize fall risk\n"
                    analysis += "• Use controlled environments for all exercises\n"
        
        analysis += "\n[Note: This is rule-based extraction. Always consult with your physician/PT for clearance]"
        
        return {
            'success': True,
            'response': analysis,
            'fallback': True
        }