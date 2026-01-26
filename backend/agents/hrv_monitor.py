from utils.gemini_client import GeminiClient
from utils.opik_logger import OpikLogger
import json

class HRVMonitorAgent:
    def __init__(self):
        self.gemini = GeminiClient(model_name="gemini-2.0-flash-lite")
        self.opik = OpikLogger()
    
    def analyze_recovery(self, hrv_data):
        """
        Analyze HRV data and recommend workout intensity
        """
        system_instruction = """You are a recovery analysis expert. Analyze HRV (Heart Rate Variability) data to assess recovery state and recommend appropriate workout intensity.

Key principles:
- HRV below baseline by >10% suggests poor recovery
- HRV below baseline by >20% suggests significant recovery deficit
- Elevated resting HR combined with low HRV indicates dehydration or overtraining
- Sleep <6 hours impairs recovery significantly

Provide step-by-step reasoning."""

        prompt = f"""
Analyze this recovery data:

Current HRV: {hrv_data['hrv_ms']}ms
Baseline HRV: {hrv_data['baseline_hrv']}ms
Deviation: {((hrv_data['hrv_ms'] - hrv_data['baseline_hrv']) / hrv_data['baseline_hrv'] * 100):.1f}%
Resting Heart Rate: {hrv_data['resting_hr']} bpm
Sleep: {hrv_data['sleep_hours']} hours

Provide:
1. Recovery state assessment (optimal/good/compromised/poor)
2. Recommended workout intensity adjustment (percentage)
3. Specific concerns (dehydration, overtraining, sleep deficit)
4. Actionable recommendations
"""
        
        response = self.gemini.generate_with_thinking(prompt, system_instruction)
        
        # FALLBACK: If Gemini API fails, use rule-based analysis
        if not response['success']:
            print(f"⚠️ Gemini API failed: {response.get('error', 'Unknown error')}")
            print("📋 Using fallback rule-based analysis...")
            response = self._fallback_analysis(hrv_data)
        
        if response['success']:
            # Log to Opik
            try:
                self.opik.log_agent_decision(
                    agent_name='hrv_monitor',
                    input_data=hrv_data,
                    output_data=response['response'],
                    reasoning=response['response'],
                    metadata={
                        'hrv_deviation_pct': ((hrv_data['hrv_ms'] - hrv_data['baseline_hrv']) / hrv_data['baseline_hrv'] * 100),
                        'recovery_compromised': hrv_data['hrv_ms'] < hrv_data['baseline_hrv'] * 0.9,
                        'fallback_used': response.get('fallback', False)
                    }
                )
            except Exception as e:
                print(f"⚠️ Opik logging failed: {e}")
        
        return response
    
    def _fallback_analysis(self, hrv_data):
        """
        Rule-based fallback when Gemini API is unavailable
        """
        deviation = ((hrv_data['hrv_ms'] - hrv_data['baseline_hrv']) / hrv_data['baseline_hrv'] * 100)
        
        # Determine recovery state
        if deviation > -5:
            state = "OPTIMAL"
            intensity_adjustment = 0
            concerns = []
        elif deviation > -15:
            state = "GOOD"
            intensity_adjustment = -10
            concerns = ["Slightly elevated stress markers"]
        elif deviation > -25:
            state = "COMPROMISED"
            intensity_adjustment = -30
            concerns = []
        else:
            state = "POOR"
            intensity_adjustment = -50
            concerns = []
        
        # Check for specific issues
        if hrv_data['resting_hr'] > 65:
            concerns.append("Elevated resting heart rate suggests dehydration or insufficient recovery")
        
        if hrv_data['sleep_hours'] < 6.5:
            concerns.append("Insufficient sleep (< 6.5 hours) significantly impairs recovery")
            intensity_adjustment -= 10
        
        if deviation < -20 and hrv_data['resting_hr'] > 70:
            concerns.append("⚠️ WARNING: Possible overtraining syndrome - consider rest day")
            intensity_adjustment = -70
        
        # Generate response
        analysis = f"""
REASONING:
1. Current HRV is {hrv_data['hrv_ms']}ms vs baseline {hrv_data['baseline_hrv']}ms
2. This represents a {deviation:.1f}% deviation from baseline
3. Resting heart rate: {hrv_data['resting_hr']} bpm (baseline ~58-65 bpm)
4. Sleep quality: {hrv_data['sleep_hours']} hours

DECISION:
Recovery State: {state}
Recommended Intensity Adjustment: {intensity_adjustment}%

EXPLANATION:
Your HRV is {abs(deviation):.1f}% {'above' if deviation > 0 else 'below'} baseline, indicating {state.lower()} recovery.

{'CONCERNS:' if concerns else 'No major concerns detected.'}
{chr(10).join('• ' + c for c in concerns) if concerns else ''}

RECOMMENDATIONS:
"""
        
        if state == "OPTIMAL":
            analysis += "• You're well-recovered and can train at full intensity\n• Consider progressive overload today\n• Maintain current sleep and recovery habits"
        elif state == "GOOD":
            analysis += "• Reduce workout volume by ~10%\n• Focus on technique over intensity\n• Ensure adequate hydration today"
        elif state == "COMPROMISED":
            analysis += "• Reduce workout intensity by 30%\n• Prioritize recovery-focused activities (mobility, light cardio)\n• Address sleep and hydration deficits\n• Avoid high-intensity or maximal effort"
        else:
            analysis += "• ⚠️ STRONG RECOMMENDATION: Take a rest day or do light active recovery only\n• Focus on sleep, hydration, and nutrition\n• Avoid any intense training\n• Consider if you're overtraining - may need extended recovery period"
        
        analysis += "\n\n[Note: This analysis uses rule-based fallback logic due to API limitations]"
        
        return {
            'success': True,
            'response': analysis,
            'fallback': True
        }