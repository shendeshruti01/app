from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class PersonalInfo(BaseModel):
    name: str
    jobTitle: str
    profilePicture: str
    coverPhoto: str
    aboutMe: str
    email: EmailStr
    phone: str
    location: str


class Experience(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(ObjectId()))
    company: str
    position: str
    startDate: str
    endDate: str
    isCurrent: bool
    description: str
    responsibilities: List[str]


class Certification(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(ObjectId()))
    name: str
    issuingOrg: str
    issueDate: str
    credentialId: str


class Skill(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(ObjectId()))
    name: str
    level: int


class SocialLinks(BaseModel):
    linkedin: str = ""
    instagram: str = ""
    facebook: str = ""
    twitter: str = ""


class Portfolio(BaseModel):
    personalInfo: PersonalInfo
    experience: List[Experience] = []
    certifications: List[Certification] = []
    skills: List[Skill] = []
    socialLinks: SocialLinks
    updatedAt: Optional[datetime] = None

    class Config:
        json_encoders = {ObjectId: str}


class Admin(BaseModel):
    username: str
    password: str
    createdAt: Optional[datetime] = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {ObjectId: str}


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    token: str
    message: str


class DocumentFile(BaseModel):
    filename: str = ""
    path: str = ""
    uploadedAt: Optional[datetime] = None


class Documents(BaseModel):
    resumePDF: Optional[DocumentFile] = DocumentFile()
    resumeDOCX: Optional[DocumentFile] = DocumentFile()
    coverLetterPDF: Optional[DocumentFile] = DocumentFile()
    coverLetterDOCX: Optional[DocumentFile] = DocumentFile()

    class Config:
        json_encoders = {ObjectId: str}
