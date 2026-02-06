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

        # FALLBACK: If Gemini API fails, use rule-based analysis
        if not response['success']:
            print(f"⚠️ Gemini API failed for nutrition analysis: {response.get('error', 'Unknown error')}")
            print("📋 Using fallback rule-based nutrition analysis...")
            analysis_text = self._fallback_nutrition_analysis(meal_description, interactions)
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

    def _fallback_nutrition_analysis(self, meal_description, interactions):
        """
        Rule-based fallback nutrition analysis when API is unavailable
        """
        meal_lower = meal_description.lower()

        # Detect protein sources
        protein_sources = []
        if any(word in meal_lower for word in ['chicken', 'turkey', 'fish', 'salmon', 'tuna', 'beef', 'pork']):
            protein_sources.append('animal protein')
        if any(word in meal_lower for word in ['beans', 'lentils', 'tofu', 'tempeh', 'chickpeas']):
            protein_sources.append('plant protein')
        if any(word in meal_lower for word in ['egg', 'greek yogurt', 'cottage cheese']):
            protein_sources.append('dairy/egg protein')

        # Detect carb sources
        carb_sources = []
        if any(word in meal_lower for word in ['rice', 'pasta', 'bread', 'potato', 'quinoa', 'oats']):
            carb_sources.append('complex carbs')
        if any(word in meal_lower for word in ['fruit', 'berries', 'banana', 'apple']):
            carb_sources.append('fruit sugars')

        # Detect fats
        fat_sources = []
        if any(word in meal_lower for word in ['avocado', 'nuts', 'olive oil', 'fatty fish', 'salmon']):
            fat_sources.append('healthy fats')

        # Detect anti-inflammatory foods
        anti_inflammatory = []
        if any(word in meal_lower for word in ['turmeric', 'ginger', 'berries', 'salmon', 'green tea']):
            anti_inflammatory.append('anti-inflammatory foods detected')
        if any(word in meal_lower for word in ['spinach', 'kale', 'broccoli', 'vegetables']):
            anti_inflammatory.append('nutrient-dense greens')

        # Build analysis
        analysis = f"""
NUTRITIONAL ANALYSIS (Rule-Based Fallback)

MACRONUTRIENT ASSESSMENT:
"""

        if protein_sources:
            analysis += f"✅ Protein: Contains {', '.join(protein_sources)}\n   - Good for muscle recovery and tissue repair\n"
            estimated_protein = "20-35g" if len(protein_sources) > 1 else "15-25g"
        else:
            analysis += "⚠️ Protein: No significant protein sources detected\n   - Consider adding protein for optimal recovery\n"
            estimated_protein = "<10g"

        if carb_sources:
            analysis += f"✅ Carbohydrates: Contains {', '.join(carb_sources)}\n   - Provides energy for recovery and workouts\n"
            estimated_carbs = "40-60g" if 'complex carbs' in carb_sources else "20-30g"
        else:
            analysis += "⚠️ Carbohydrates: Low carb meal\n   - May be appropriate depending on timing and goals\n"
            estimated_carbs = "<15g"

        if fat_sources:
            analysis += f"✅ Fats: Contains {', '.join(fat_sources)}\n   - Supports hormone production and nutrient absorption\n"
            estimated_fats = "15-25g"
        else:
            analysis += "ℹ️ Fats: Minimal fat content\n   - Consider adding healthy fats for satiety\n"
            estimated_fats = "<10g"

        analysis += f"\nESTIMATED MACROS:\n- Protein: ~{estimated_protein}\n- Carbs: ~{estimated_carbs}\n- Fats: ~{estimated_fats}\n"

        analysis += "\nRECOVERY BENEFITS:\n"
        if anti_inflammatory:
            analysis += "✅ " + "\n✅ ".join(anti_inflammatory) + "\n"
        if protein_sources:
            analysis += "✅ Protein supports muscle repair and recovery\n"
        if 'complex carbs' in carb_sources:
            analysis += "✅ Complex carbs replenish glycogen stores\n"

        analysis += "\nTIMING RECOMMENDATIONS:\n"
        if protein_sources and carb_sources:
            analysis += "🕐 Best consumed: Post-workout (within 2 hours) for optimal recovery\n"
        elif protein_sources:
            analysis += "🕐 Best consumed: Anytime - good for sustained energy\n"
        else:
            analysis += "🕐 Consider pairing with protein for better recovery support\n"

        # Add interaction warning if present
        if interactions:
            analysis += f"\n⚠️ MEDICATION INTERACTIONS DETECTED ({len(interactions)}):\n"
            for interaction in interactions[:3]:  # Show first 3
                analysis += f"- {interaction['description']}\n"
            if len(interactions) > 3:
                analysis += f"- ...and {len(interactions) - 3} more\n"
            analysis += "\n**Please consult your healthcare provider about these interactions.**\n"

        analysis += "\n[Note: This analysis uses rule-based logic due to AI API limitations. For detailed nutritional information, consult a registered dietitian.]"

        return analysis