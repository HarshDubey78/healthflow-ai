from utils.gemini_client import GeminiClient
from utils.opik_logger import OpikLogger
from data.medication_interactions import check_interaction

class NutritionAdvisorAgent:
    def __init__(self):
        self.gemini = GeminiClient(model_name="gemini-2.0-flash-lite")
        self.opik = OpikLogger()
    
    def analyze_meal(self, meal_description, medications):
        """
        Analyze meal for nutrition and medication interactions
        """
        # First, check known interactions
        food_items = meal_description.split(',')
        interactions = []
        
        for medication in medications:
            med_interactions = check_interaction(medication, food_items)
            interactions.extend(med_interactions)
        
        # Then use Gemini for nutritional analysis
        system_instruction = """You are a nutrition advisor specializing in recovery nutrition.
Analyze meals for macronutrient content and recovery benefits."""

        prompt = f"""
Meal: "{meal_description}"

Provide:
1. Estimated macros (protein/carbs/fats in grams)
2. Recovery benefits (anti-inflammatory properties, protein for tissue repair, etc.)
3. Portion assessment (is this appropriate for active recovery?)
4. Timing recommendations (when to eat this for optimal recovery)
"""
        
        response = self.gemini.generate_with_thinking(prompt, system_instruction)

        # Provide better error message if API fails
        if not response['success']:
            print(f"⚠️ Gemini API failed for nutrition analysis: {response.get('error', 'Unknown error')}")
            analysis_text = f"""
⚠️ AI Analysis Unavailable

Unfortunately, the AI nutritional analysis could not be generated at this time.
Error: {response.get('error', 'API quota may be exceeded')}

Basic Assessment:
- Please review the medication interactions shown above
- Consult with your healthcare provider about specific food-medication interactions
- Consider general recovery nutrition principles: adequate protein, anti-inflammatory foods, hydration

[Note: Full AI analysis unavailable due to API limitations]
"""
        else:
            analysis_text = response['response']

        result = {
            'nutritional_analysis': analysis_text,
            'medication_interactions': interactions,
            'safe_to_consume': len(interactions) == 0 or all(i['severity'] != 'high' for i in interactions)
        }

        # Log to Opik
        try:
            self.opik.log_agent_decision(
                agent_name='nutrition_advisor',
                input_data={'meal': meal_description, 'medications': medications},
                output_data=result,
                reasoning=response.get('response', ''),
                metadata={
                    'interactions_found': len(interactions),
                    'interaction_severity': [i['severity'] for i in interactions],
                    'api_success': response['success']
                }
            )
        except Exception as e:
            print(f"⚠️ Opik logging failed: {e}")

        return result