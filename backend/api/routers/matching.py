import io
from typing import List, Optional
import PyPDF2
from docx import Document
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel, Field

from backend.services.llm.engine import OllamaLLMEngine

router = APIRouter()

# In-memory storage (for development only)
resume_storage: Optional[str] = None
jd_storage: Optional[str] = None

# Initialize LLM Engine
llm_engine = OllamaLLMEngine()


class JobDescription(BaseModel):
    content: str = Field(description="Description of the job that we would like to compare with.")


class Experience(BaseModel):
    matched: List[str]
    years_match: bool


class MatchingSkills(BaseModel):
    technical_skills: List[str]
    soft_skills: List[str]
    experience: Experience


class MissingSkills(BaseModel):
    critical: List[str]
    preferred: List[str]
    experience_gaps: List[str]


class Analysis(BaseModel):
    summary: List[str]
    strengths: List[str]
    improvement_areas: List[str]
    recommendations: List[str]


class MatchingResponse(BaseModel):
    match_score: float
    matching_skills: MatchingSkills
    missing_skills: MissingSkills
    analysis: Analysis


async def extract_text_from_file(file_content: bytes, filename: str) -> str:
    """Extract text from PDF or DOCX files."""
    if filename.endswith('.pdf'):
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    elif filename.endswith('.docx'):
        doc = Document(io.BytesIO(file_content))
        return " ".join([paragraph.text for paragraph in doc.paragraphs])
    else:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format"
        )


@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    global resume_storage

    # Validate file type
    if not file.filename.endswith(('.pdf', '.docx')):
        raise HTTPException(
            status_code=400,
            detail="File format not supported. Please upload PDF or DOCX"
        )

    # Read and store file content
    content = await file.read()

    # Extract text from file
    try:
        extracted_text = await extract_text_from_file(content, file.filename)
        resume_storage = extracted_text
        return {"message": "Resume uploaded and processed successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing file: {str(e)}"
        )


@router.post("/submit-jd")
async def submit_jd(jd: JobDescription):
    global jd_storage

    if not jd.content.strip():
        raise HTTPException(
            status_code=400,
            detail="Job description cannot be empty"
        )

    jd_storage = jd.content
    return {"message": "Job description submitted successfully"}


@router.get("/match", response_model=MatchingResponse)
async def match_resume_jd():
    if not resume_storage or not jd_storage:
        raise HTTPException(
            status_code=400,
            detail="Both resume and job description must be uploaded first"
        )

    # Check if Ollama is ready
    if not await llm_engine.is_model_ready():
        raise HTTPException(
            status_code=503,
            detail="LLM service is not ready. Please ensure Ollama is running with Llama3 model."
        )

    try:
        # Perform matching analysis
        result = await llm_engine.analyze_resume_jd(resume_storage, jd_storage)

        if "error" in result:
            raise HTTPException(
                status_code=500,
                detail=result["error"]
            )

        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error during analysis: {str(e)}"
        )
