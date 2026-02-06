from opik import Opik
from opik.api_objects import trace
import os
from dotenv import load_dotenv
from datetime import datetime
import json

load_dotenv()

class OpikLogger:
    def __init__(self):
        self.enabled = False
        self.client = None
        self.project_name = "healthflow-ai"

        # Opik SDK reads credentials from environment variables
        # OPIK_API_KEY, OPIK_URL_OVERRIDE, OPIK_WORKSPACE, OPIK_PROJECT_NAME
        api_key = os.getenv('OPIK_API_KEY')
        workspace = os.getenv('OPIK_WORKSPACE', 'default')
        host = os.getenv('OPIK_URL_OVERRIDE')
        project = os.getenv('OPIK_PROJECT_NAME', 'healthflow-ai')

        if api_key and api_key != 'your_opik_key_here':
            try:
                # Opik SDK automatically uses OPIK_API_KEY from environment
                self.client = Opik(
                    project_name=project,
                    workspace=workspace,
                    host=host
                )
                self.project_name = project
                self.enabled = True
                print(f"✅ Opik observability enabled (project: {project})")
            except Exception as e:
                print(f"⚠️ Opik initialization failed: {e}")
                print("📋 Continuing without observability logging")
        else:
            print("📋 Opik not configured - skipping observability logging")

    def log_agent_decision(self, agent_name, input_data, output_data, reasoning, metadata=None):
        """
        Log agent decision to Opik using traces
        """
        if not self.enabled or not self.client:
            return True

        try:
            # Create a trace for the agent call
            trace_obj = self.client.trace(
                name=f"{agent_name}_decision",
                input=self._sanitize_for_json(input_data),
                output=self._sanitize_for_json(output_data),
                metadata={
                    "agent": agent_name,
                    "timestamp": datetime.now().isoformat(),
                    "reasoning_provided": bool(reasoning),
                    **(metadata or {})
                },
                tags=[agent_name, "multi-agent", "healthflow"]
            )
            trace_obj.end()

            # Log specific metrics based on agent type
            if agent_name == "workout_orchestrator":
                safe_workout = metadata.get('safe_workout', False) if metadata else False
                safety_trace = self.client.trace(
                    name="workout_safety_check",
                    input={"constraints": input_data.get('medical', {})},
                    output={
                        "safe": safe_workout,
                        "violations": metadata.get('constraint_violations', []) if metadata else []
                    },
                    metadata={"safety_score": 1.0 if safe_workout else 0.0},
                    tags=["safety", "constraints"]
                )
                safety_trace.end()

            return True
        except Exception as e:
            print(f"⚠️ Opik logging error: {e}")
            # Don't fail the app if logging fails
            return False

    def log_constraint_check(self, constraints_satisfied, violations):
        """
        Log constraint satisfaction metrics
        """
        if not self.enabled or not self.client:
            return

        try:
            # Log constraint check as a separate trace
            trace_obj = self.client.trace(
                name="constraint_validation",
                input={"constraints_count": 1},
                output={
                    "satisfied": constraints_satisfied,
                    "violations": violations
                },
                metadata={
                    "violation_count": len(violations) if violations else 0,
                    "safety_score": 1.0 if constraints_satisfied else 0.0
                },
                tags=["safety", "validation", "constraints"]
            )
            trace_obj.end()
        except Exception as e:
            print(f"⚠️ Metric logging error: {e}")

    def log_multi_agent_orchestration(self, agents_involved, workflow_input, workflow_output, metadata=None):
        """
        Log the entire multi-agent workflow orchestration
        """
        if not self.enabled or not self.client:
            return

        try:
            trace_obj = self.client.trace(
                name="multi_agent_workflow",
                input=self._sanitize_for_json(workflow_input),
                output=self._sanitize_for_json(workflow_output),
                metadata={
                    "agents": agents_involved,
                    "agent_count": len(agents_involved),
                    "timestamp": datetime.now().isoformat(),
                    **(metadata or {})
                },
                tags=["orchestration", "multi-agent", "workflow"]
            )
            trace_obj.end()
        except Exception as e:
            print(f"⚠️ Orchestration logging error: {e}")

    def _sanitize_for_json(self, data):
        """
        Convert data to JSON-serializable format
        """
        if isinstance(data, dict):
            return {k: self._sanitize_for_json(v) for k, v in data.items()}
        elif isinstance(data, list):
            return [self._sanitize_for_json(item) for item in data]
        elif isinstance(data, (str, int, float, bool, type(None))):
            return data
        else:
            return str(data)
