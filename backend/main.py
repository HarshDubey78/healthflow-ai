from flask import Flask, request, jsonify
from flask_cors import CORS
from agents.hrv_monitor import HRVMonitorAgent
from agents.medical_parser import MedicalParserAgent
from agents.nutrition_advisor import NutritionAdvisorAgent
from agents.workout_orchestrator import WorkoutOrchestratorAgent
from data.mock_hrv_data import get_today_hrv
import os

app = Flask(__name__)

# Enable CORS for all routes and origins (for development)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Initialize agents
hrv_agent = HRVMonitorAgent()
medical_agent = MedicalParserAgent()
nutrition_agent = NutritionAdvisorAgent()
workout_agent = WorkoutOrchestratorAgent()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'HealthFlow AI API is running'})

@app.route('/api/hrv/check', methods=['GET'])
def check_hrv():
    """Get today's HRV and analysis"""
    try:
        hrv_data = get_today_hrv()
        analysis = hrv_agent.analyze_recovery(hrv_data)
        
        return jsonify({
            'hrv_data': hrv_data,
            'analysis': analysis
        })
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Failed to analyze HRV'
        }), 500

@app.route('/api/medical/parse', methods=['POST'])
def parse_medical():
    """Extract constraints from medical profile"""
    try:
        medical_profile = request.json
        constraints = medical_agent.extract_constraints(medical_profile)
        
        return jsonify(constraints)
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Failed to parse medical profile'
        }), 500

@app.route('/api/nutrition/analyze', methods=['POST'])
def analyze_nutrition():
    """Analyze meal for nutrition and interactions"""
    try:
        data = request.json
        meal = data.get('meal_description')
        medications = data.get('medications', [])
        
        analysis = nutrition_agent.analyze_meal(meal, medications)
        
        return jsonify(analysis)
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Failed to analyze nutrition'
        }), 500

@app.route('/api/workout/generate', methods=['POST'])
def generate_workout():
    """Generate adaptive workout plan"""
    try:
        data = request.json
        
        workout = workout_agent.generate_workout(
            medical_constraints=data.get('medical_constraints'),
            hrv_analysis=data.get('hrv_analysis'),
            user_context=data.get('user_context')
        )
        
        return jsonify(workout)
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Failed to generate workout'
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    # Increase timeout for slow AI operations
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
    app.config['JSON_SORT_KEYS'] = False
    app.run(debug=True, host='0.0.0.0', port=port, threaded=True)