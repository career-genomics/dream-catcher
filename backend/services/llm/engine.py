import json
import os
from typing import Dict, Any

import requests


class OllamaLLMEngine:
    """Handles interaction with Ollama LLM service."""

    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url
        OLLAMA_HOST = os.getenv("OLLAMA_HOST")
        if OLLAMA_HOST is not None:
            self.base_url = OLLAMA_HOST
        print(f"setting ollama host url to {self.base_url}")
        self.api_url = f"{self.base_url}/api/generate"
        self.model = "llama3.2:latest"

    async def analyze_resume_jd(self, resume_text: str, jd_text: str) -> Dict[str, Any]:
        """Analyze resume and job description match using Ollama."""
        try:
            prompt = f"""
            You are a professional resume analyzer. IMPORTANT: Return ONLY raw JSON, with no additional text, no markdown, no code block markers.

            RESUME:
            {resume_text}

            JOB DESCRIPTION:
            {jd_text}

            Remember: The response should be ONLY THE JSON OBJECT, nothing else. No explanations, no markdown, no code blocks.
            Return exactly this structure:
            {{
                "match_score": <number between 0-100>,
                "matching_skills": {{
                    "technical_skills": [<list of matched technical skills>],
                    "soft_skills": [<list of matched soft skills>],
                    "experience": {{
                        "matched": [<list of relevant experience areas>],
                        "years_match": <true/false>
                    }}
                }},
                "missing_skills": {{
                    "critical": [<list of critical missing skills>],
                    "preferred": [<list of preferred but missing skills>],
                    "experience_gaps": [<list of experience gaps>]
                }},
                "analysis": {{
                    "summary": [<list of summary of overall match assessment>],
                    "strengths": [<list of key strengths>],
                    "improvement_areas": [<list of areas needing improvement>],
                    "recommendations": [<list of specific recommendations>]
                }}
            }}
            """

            response = requests.post(
                self.api_url,
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "num_ctx": 8192,  # Reduced context window
                        "temperature": 0.1,  # Lower temperature for more deterministic outputs
                        "top_p": 0.9
                    },
                    "format": "json",  # Request JSON format if Ollama supports this
                    "stop": ["\n\n", "```"],  # Stop sequences to prevent extra content
                    "timeout": 120  # 2-minute timeout
                },
                timeout=180  # Request timeout (3 minutes)
            )
            response.raise_for_status()

            llm_response = response.json().get('response', '')
            print("Raw LLM Response:", llm_response)  # Keep for debugging

            # Clean and extract JSON
            # json_str = self._extract_json(llm_response)
            analysis_result = json.loads(llm_response)

            return analysis_result

        except Exception as e:
            print(f"Error in analysis: {str(e)}")
            return {
                "error": "Failed to analyze resume and job description",
                "details": str(e)
            }

    async def is_model_ready(self) -> bool:
        """Check if the Ollama service and model are ready."""
        try:
            response = requests.get(f"{self.base_url}/api/tags")
            return self.model in [tag['name'] for tag in response.json().get('models', [])]
        except requests.exceptions.RequestException:
            return False
