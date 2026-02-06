from http.server import BaseHTTPRequestHandler
import json
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'lib'))

from lib.agents.workout_orchestrator import WorkoutOrchestratorAgent

agent = WorkoutOrchestratorAgent()

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        """Generate adaptive workout plan"""
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))

            # Extract parameters
            medical_constraints = data.get('medical_constraints', '')
            hrv_analysis = data.get('hrv_analysis', '')
            user_context = data.get('user_context', {})

            # Generate workout
            result = agent.generate_workout(
                medical_constraints=medical_constraints,
                hrv_analysis=hrv_analysis,
                user_context=user_context
            )

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            self.wfile.write(json.dumps(result).encode())

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            self.wfile.write(json.dumps({'error': str(e)}).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
