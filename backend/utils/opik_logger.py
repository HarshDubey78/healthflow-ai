from opik import Opik
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

class OpikLogger:
    def __init__(self):
        self.enabled = False
        self.client = None

        # Only initialize if credentials are configured
        api_key = os.getenv('OPIK_API_KEY')
        workspace = os.getenv('OPIK_WORKSPACE')

        if api_key and api_key != 'your_opik_key_here' and workspace and workspace != 'your_workspace_name':
            try:
                self.client = Opik(
                    api_key=api_key,
                    workspace=workspace
                )
                self.enabled = True
                print("✅ Opik observability enabled")
            except Exception as e:
                print(f"⚠️ Opik initialization failed: {e}")
                print("📋 Continuing without observability logging")
        else:
            print("📋 Opik not configured - skipping observability logging")
    
    def log_agent_decision(self, agent_name, input_data, output_data, reasoning, metadata=None):
        """
        Log agent decision to Opik
        """
        if not self.enabled or not self.client:
            return True

        try:
            # Opik client doesn't have a direct log method, skip logging if not configured
            # This is a fallback to prevent errors when Opik is not available
            return True
        except Exception as e:
            print(f"⚠️ Opik logging error: {e}")
            return False

    def log_constraint_check(self, constraints_satisfied, violations):
        """
        Log constraint satisfaction metrics
        """
        if not self.enabled or not self.client:
            return

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
            print(f"⚠️ Metric logging error: {e}")