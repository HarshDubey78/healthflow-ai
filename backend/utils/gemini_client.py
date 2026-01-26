import google.generativeai as genai
import os
from dotenv import load_dotenv
import json

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

class GeminiClient:
    def __init__(self, model_name="gemini-2.0-flash-lite"):
        """
        Initialize Gemini client
        model_name options:
        - gemini-2.0-flash-lite (recommended for development - 1000 req/day)
        - gemini-2.0-flash (20 req/day)
        - gemini-2.0-pro (25-50 req/day for complex reasoning)
        """
        self.model = genai.GenerativeModel(
            model_name=model_name,
            generation_config={
                "temperature": 0.7,
                "top_p": 0.95,
                "top_k": 40,
                "max_output_tokens": 2048,
            }
        )
    
    def generate_with_thinking(self, prompt, system_instruction=None):
        """
        Generate response with step-by-step reasoning
        """
        # Add thinking instruction to prompt
        thinking_prompt = f"""
{system_instruction or ''}

{prompt}

Please provide your response in this format:
REASONING:
[Your step-by-step thought process]

DECISION:
[Your final recommendation]

EXPLANATION:
[Brief explanation for the user]
"""
        
        try:
            response = self.model.generate_content(thinking_prompt)
            return {
                'success': True,
                'response': response.text,
                'full_response': response
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def parse_json_response(self, prompt):
        """
        Get structured JSON response from Gemini
        """
        json_prompt = f"{prompt}\n\nRespond ONLY with valid JSON, no markdown formatting."
        
        try:
            response = self.model.generate_content(json_prompt)
            # Clean response (remove markdown if present)
            text = response.text.strip()
            if text.startswith('```json'):
                text = text[7:]
            if text.endswith('```'):
                text = text[:-3]
            
            return json.loads(text.strip())
        except Exception as e:
            print(f"Error parsing JSON: {e}")
            return None