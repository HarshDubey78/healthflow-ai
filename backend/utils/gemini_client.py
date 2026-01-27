import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
import time
from utils.cache import SimpleCache

load_dotenv()

# Configure Gemini
api_key = os.getenv('GEMINI_API_KEY')

if not api_key or api_key == 'your_gemini_api_key_here':
    print("="*60)
    print("⚠️  WARNING: GEMINI_API_KEY not configured!")
    print("="*60)
    print("Please set your Gemini API key in backend/.env")
    print("Get your API key from: https://aistudio.google.com/app/apikey")
    print("All agents will use fallback rule-based logic until configured.")
    print("="*60)
    api_key = None  # Will cause API calls to fail gracefully

if api_key:
    genai.configure(api_key=api_key)
    print("✅ Gemini API configured successfully")
else:
    print("⚠️  Running in FALLBACK MODE (rule-based responses only)")

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
        self.cache = SimpleCache()
        self.max_retries = 3
        self.retry_delay = 2  # seconds
    
    def generate_with_thinking(self, prompt, system_instruction=None):
        """
        Generate response with step-by-step reasoning
        Uses caching to reduce API calls and retry logic for rate limits
        """
        if not api_key:
            return {
                'success': False,
                'error': 'GEMINI_API_KEY not configured. Please set it in backend/.env'
            }

        # Create cache key from prompt and system instruction
        cache_data = {
            'prompt': prompt,
            'system_instruction': system_instruction,
            'type': 'thinking'
        }

        # Try to get from cache first
        cached_response = self.cache.get(cache_data)
        if cached_response:
            return cached_response

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

        # Retry logic for rate limiting
        for attempt in range(self.max_retries):
            try:
                response = self.model.generate_content(thinking_prompt)
                result = {
                    'success': True,
                    'response': response.text,
                    'full_response': response
                }

                # Cache successful response
                self.cache.set(cache_data, result)

                return result

            except Exception as e:
                error_msg = str(e)

                # Check if it's a rate limit error
                is_rate_limit = ('quota' in error_msg.lower() or
                               'rate limit' in error_msg.lower() or
                               'too many requests' in error_msg.lower() or
                               '429' in error_msg)

                # If rate limited and not last attempt, retry with backoff
                if is_rate_limit and attempt < self.max_retries - 1:
                    wait_time = self.retry_delay * (2 ** attempt)  # Exponential backoff
                    print(f"⚠️ Rate limited. Retrying in {wait_time}s... (attempt {attempt + 1}/{self.max_retries})")
                    time.sleep(wait_time)
                    continue

                # Provide helpful error messages
                if 'API_KEY_INVALID' in error_msg or 'invalid api key' in error_msg.lower():
                    error_msg = 'Invalid API key. Please check your GEMINI_API_KEY in backend/.env'
                elif is_rate_limit:
                    error_msg = f'API quota exceeded. Using fallback logic. (Original error: {error_msg})'

                return {
                    'success': False,
                    'error': error_msg
                }
    
    def parse_json_response(self, prompt):
        """
        Get structured JSON response from Gemini
        Uses caching and retry logic
        """
        if not api_key:
            print("❌ Error: GEMINI_API_KEY not configured")
            return None

        # Create cache key
        cache_data = {
            'prompt': prompt,
            'type': 'json'
        }

        # Try cache first
        cached_response = self.cache.get(cache_data)
        if cached_response:
            return cached_response

        json_prompt = f"{prompt}\n\nRespond ONLY with valid JSON, no markdown formatting."

        # Retry logic
        for attempt in range(self.max_retries):
            try:
                response = self.model.generate_content(json_prompt)
                # Clean response (remove markdown if present)
                text = response.text.strip()
                if text.startswith('```json'):
                    text = text[7:]
                if text.endswith('```'):
                    text = text[:-3]

                result = json.loads(text.strip())

                # Cache successful response
                self.cache.set(cache_data, result)

                return result

            except Exception as e:
                error_msg = str(e)

                # Check if it's a rate limit error
                is_rate_limit = ('quota' in error_msg.lower() or
                               'rate limit' in error_msg.lower() or
                               'too many requests' in error_msg.lower() or
                               '429' in error_msg)

                # If rate limited and not last attempt, retry
                if is_rate_limit and attempt < self.max_retries - 1:
                    wait_time = self.retry_delay * (2 ** attempt)
                    print(f"⚠️ Rate limited. Retrying in {wait_time}s... (attempt {attempt + 1}/{self.max_retries})")
                    time.sleep(wait_time)
                    continue

                # Log error
                if 'API_KEY_INVALID' in error_msg or 'invalid api key' in error_msg.lower():
                    print(f"❌ Error: Invalid API key. Please check your GEMINI_API_KEY in backend/.env")
                elif is_rate_limit:
                    print(f"❌ Error: API quota exceeded: {error_msg}")
                else:
                    print(f"❌ Error parsing JSON: {e}")
                return None