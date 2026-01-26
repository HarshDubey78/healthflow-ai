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
        
        result = {
            'nutritional_analysis': response['response'] if response['success'] else 'Analysis failed',
            'medication_interactions': interactions,
            'safe_to_consume': len(interactions) == 0 or all(i['severity'] != 'high' for i in interactions)
        }
        
        # Log to Opik
        self.opik.log_agent_decision(
            agent_name='nutrition_advisor',
            input_data={'meal': meal_description, 'medications': medications},
            output_data=result,
            reasoning=response.get('response', ''),
            metadata={
                'interactions_found': len(interactions),
                'interaction_severity': [i['severity'] for i in interactions]
            }
        )
        
        return result