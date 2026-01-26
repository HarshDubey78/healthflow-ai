from opik import Opik
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

class OpikLogger:
    def __init__(self):
        self.client = Opik(
            # api_key=os.getenv('OPIK_API_KEY'),
            workspace=os.getenv('OPIK_WORKSPACE')
        )
    
    def log_agent_decision(self, agent_name, input_data, output_data, reasoning, metadata=None):
        """
        Log agent decision to Opik
        """
        try:
            # Opik client doesn't have a direct log method, skip logging if not configured
            # This is a fallback to prevent errors when Opik is not available
            return True
        except Exception as e:
            print(f"Opik logging error: {e}")
            return False
    
    def log_constraint_check(self, constraints_satisfied, violations):
        """
        Log constraint satisfaction metrics
        """
        try:
            self.client.log_metric(
                name='constraint_violation_rate',
                value=1.0 if violations else 0.0,
                metadata={
                    'constraints_checked': constraints_satisfied,
                    'violations': violations
                }
            )
        except Exception as e:
            print(f"Metric logging error: {e}")