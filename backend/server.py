from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from typing import Optional
from datetime import datetime, timedelta
import shutil

from models import (
    LoginRequest, LoginResponse, PersonalInfo, SocialLinks,
    Experience, Certification, Skill, Portfolio
)
from auth import (
    verify_password, create_access_token, get_current_user, hash_password
)
from database import (
    portfolio_collection, admin_collection, documents_collection,
    init_database
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create uploads directory
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)
(UPLOAD_DIR / "resumes").mkdir(exist_ok=True)
(UPLOAD_DIR / "cover-letters").mkdir(exist_ok=True)

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ===== PUBLIC ENDPOINTS =====

@api_router.get("/")
async def root():
    return {"message": "Portfolio API is running"}


@api_router.get("/portfolio")
async def get_portfolio():
    """Get complete portfolio data"""
    try:
        portfolio = await portfolio_collection.find_one({})
        if not portfolio:
            raise HTTPException(status_code=404, detail="Portfolio not found")
        
        # Remove MongoDB _id field
        portfolio.pop('_id', None)
        return portfolio
    except Exception as e:
        logger.error(f"Error fetching portfolio: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@api_router.get("/documents/download/{doc_type}")
async def download_document(doc_type: str):
    """Download documents (resume-pdf, resume-docx, cover-letter-pdf, cover-letter-docx)"""
    try:
        documents = await documents_collection.find_one({})
        if not documents:
            raise HTTPException(status_code=404, detail="No documents found")
        
        # Map document types to database fields
        doc_mapping = {
            "resume-pdf": "resumePDF",
            "resume-docx": "resumeDOCX",
            "cover-letter-pdf": "coverLetterPDF",
            "cover-letter-docx": "coverLetterDOCX"
        }
        
        if doc_type not in doc_mapping:
            raise HTTPException(status_code=400, detail="Invalid document type")
        
        doc_field = doc_mapping[doc_type]
        doc_info = documents.get(doc_field, {})
        
        if not doc_info or not doc_info.get("path"):
            raise HTTPException(status_code=404, detail="Document not found")
        
        file_path = Path(doc_info["path"])
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="File not found on server")
        
        return FileResponse(
            path=file_path,
            filename=doc_info["filename"],
            media_type='application/octet-stream'
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error downloading document: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


# ===== AUTHENTICATION ENDPOINTS =====

@api_router.post("/auth/login", response_model=LoginResponse)
async def login(credentials: LoginRequest):
    """Admin login"""
    try:
        admin = await admin_collection.find_one({"username": credentials.username})
        if not admin:
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        if not verify_password(credentials.password, admin["password"]):
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        # Create access token
        access_token = create_access_token(
            data={"sub": admin["username"]},
            expires_delta=timedelta(hours=24)
        )
        
        return LoginResponse(token=access_token, message="Login successful")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during login: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@api_router.post("/auth/verify")
async def verify_token(username: str = Depends(get_current_user)):
    """Verify JWT token"""
    return {"valid": True, "username": username}


# ===== PROTECTED ADMIN ENDPOINTS =====

@api_router.put("/admin/portfolio/personal")
async def update_personal_info(
    personal_info: PersonalInfo,
    username: str = Depends(get_current_user)
):
    """Update personal information"""
    try:
        result = await portfolio_collection.update_one(
            {},
            {
                "$set": {
                    "personalInfo": personal_info.dict(),
                    "updatedAt": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Portfolio not found")
        
        return {"success": True, "message": "Personal information updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating personal info: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@api_router.put("/admin/portfolio/social-links")
async def update_social_links(
    social_links: SocialLinks,
    username: str = Depends(get_current_user)
):
    """Update social links"""
    try:
        result = await portfolio_collection.update_one(
            {},
            {
                "$set": {
                    "socialLinks": social_links.dict(),
                    "updatedAt": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Portfolio not found")
        
        return {"success": True, "message": "Social links updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating social links: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@api_router.post("/admin/portfolio/experience")
async def add_experience(
    experience: Experience,
    username: str = Depends(get_current_user)
):
    """Add new experience"""
    try:
        result = await portfolio_collection.update_one(
            {},
            {
                "$push": {"experience": experience.dict()},
                "$set": {"updatedAt": datetime.utcnow()}
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Portfolio not found")
        
        return {"success": True, "message": "Experience added successfully", "data": experience}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error adding experience: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@api_router.put("/admin/portfolio/experience/{exp_id}")
async def update_experience(
    exp_id: str,
    experience: Experience,
    username: str = Depends(get_current_user)
):
    """Update experience by ID"""
    try:
        result = await portfolio_collection.update_one(
            {"experience.id": exp_id},
            {
                "$set": {
                    "experience.$": experience.dict(),
                    "updatedAt": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Experience not found")
        
        return {"success": True, "message": "Experience updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating experience: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@api_router.delete("/admin/portfolio/experience/{exp_id}")
async def delete_experience(
    exp_id: str,
    username: str = Depends(get_current_user)
):
    """Delete experience by ID"""
    try:
        result = await portfolio_collection.update_one(
            {},
            {
                "$pull": {"experience": {"id": exp_id}},
                "$set": {"updatedAt": datetime.utcnow()}
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Experience not found")
        
        return {"success": True, "message": "Experience deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting experience: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@api_router.post("/admin/portfolio/certification")
async def add_certification(
    certification: Certification,
    username: str = Depends(get_current_user)
):
    """Add new certification"""
    try:
        result = await portfolio_collection.update_one(
            {},
            {
                "$push": {"certifications": certification.dict()},
                "$set": {"updatedAt": datetime.utcnow()}
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Portfolio not found")
        
        return {"success": True, "message": "Certification added successfully", "data": certification}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error adding certification: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@api_router.put("/admin/portfolio/certification/{cert_id}")
async def update_certification(
    cert_id: str,
    certification: Certification,
    username: str = Depends(get_current_user)
):
    """Update certification by ID"""
    try:
        result = await portfolio_collection.update_one(
            {"certifications.id": cert_id},
            {
                "$set": {
                    "certifications.$": certification.dict(),
                    "updatedAt": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Certification not found")
        
        return {"success": True, "message": "Certification updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating certification: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@api_router.delete("/admin/portfolio/certification/{cert_id}")
async def delete_certification(
    cert_id: str,
    username: str = Depends(get_current_user)
):
    """Delete certification by ID"""
    try:
        result = await portfolio_collection.update_one(
            {},
            {
                "$pull": {"certifications": {"id": cert_id}},
                "$set": {"updatedAt": datetime.utcnow()}
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Certification not found")
        
        return {"success": True, "message": "Certification deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting certification: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@api_router.post("/admin/portfolio/skill")
async def add_skill(
    skill: Skill,
    username: str = Depends(get_current_user)
):
    """Add new skill"""
    try:
        result = await portfolio_collection.update_one(
            {},
            {
                "$push": {"skills": skill.dict()},
                "$set": {"updatedAt": datetime.utcnow()}
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Portfolio not found")
        
        return {"success": True, "message": "Skill added successfully", "data": skill}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error adding skill: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@api_router.put("/admin/portfolio/skill/{skill_id}")
async def update_skill(
    skill_id: str,
    skill: Skill,
    username: str = Depends(get_current_user)
):
    """Update skill by ID"""
    try:
        result = await portfolio_collection.update_one(
            {"skills.id": skill_id},
            {
                "$set": {
                    "skills.$": skill.dict(),
                    "updatedAt": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Skill not found")
        
        return {"success": True, "message": "Skill updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating skill: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@api_router.delete("/admin/portfolio/skill/{skill_id}")
async def delete_skill(
    skill_id: str,
    username: str = Depends(get_current_user)
):
    """Delete skill by ID"""
    try:
        result = await portfolio_collection.update_one(
            {},
            {
                "$pull": {"skills": {"id": skill_id}},
                "$set": {"updatedAt": datetime.utcnow()}
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Skill not found")
        
        return {"success": True, "message": "Skill deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting skill: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@api_router.post("/admin/documents/upload")
async def upload_documents(
    username: str = Depends(get_current_user),
    resumePDF: Optional[UploadFile] = File(None),
    resumeDOCX: Optional[UploadFile] = File(None),
    coverLetterPDF: Optional[UploadFile] = File(None),
    coverLetterDOCX: Optional[UploadFile] = File(None)
):
    """Upload documents"""
    try:
        uploaded_files = {}
        documents = await documents_collection.find_one({})
        
        if not documents:
            # Create documents record if it doesn't exist
            documents = {
                "resumePDF": {"filename": "", "path": "", "uploadedAt": None},
                "resumeDOCX": {"filename": "", "path": "", "uploadedAt": None},
                "coverLetterPDF": {"filename": "", "path": "", "uploadedAt": None},
                "coverLetterDOCX": {"filename": "", "path": "", "uploadedAt": None}
            }
            await documents_collection.insert_one(documents)
            documents = await documents_collection.find_one({})
        
        # Helper function to save file
        async def save_file(file: UploadFile, category: str, field_name: str):
            if file:
                # Validate file type
                allowed_types = {
                    "PDF": ["application/pdf"],
                    "DOCX": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
                }
                
                file_type = field_name.split("resume")[-1].split("coverLetter")[-1]
                if file.content_type not in allowed_types.get(file_type, []):
                    raise HTTPException(status_code=400, detail=f"Invalid file type for {field_name}")
                
                # Save file
                timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
                filename = f"{timestamp}_{file.filename}"
                file_path = UPLOAD_DIR / category / filename
                
                with open(file_path, "wb") as buffer:
                    shutil.copyfileobj(file.file, buffer)
                
                # Update database
                await documents_collection.update_one(
                    {"_id": documents["_id"]},
                    {
                        "$set": {
                            field_name: {
                                "filename": file.filename,
                                "path": str(file_path),
                                "uploadedAt": datetime.utcnow()
                            }
                        }
                    }
                )
                
                uploaded_files[field_name] = file.filename
        
        # Save all uploaded files
        if resumePDF:
            await save_file(resumePDF, "resumes", "resumePDF")
        if resumeDOCX:
            await save_file(resumeDOCX, "resumes", "resumeDOCX")
        if coverLetterPDF:
            await save_file(coverLetterPDF, "cover-letters", "coverLetterPDF")
        if coverLetterDOCX:
            await save_file(coverLetterDOCX, "cover-letters", "coverLetterDOCX")
        
        if not uploaded_files:
            raise HTTPException(status_code=400, detail="No files uploaded")
        
        return {
            "success": True,
            "message": "Documents uploaded successfully",
            "uploadedFiles": uploaded_files
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading documents: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    await init_database()
    logger.info("Database initialized")