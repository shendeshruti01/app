# API Contracts & Integration Protocol

## Overview
This document defines the contract between frontend and backend for the personal portfolio website with admin panel.

## Current Mock Data Structure (in `/app/frontend/src/mock.js`)
- Personal Information (name, job title, profile/cover images, about, contact)
- Experience (array of job history)
- Certifications (array of credentials)
- Skills (array with proficiency levels)
- Social Links (LinkedIn, Instagram, Facebook, Twitter)
- Documents (resume & cover letter in PDF/DOCX)

## Backend Architecture

### Database Models (MongoDB)

#### 1. Admin Model
```javascript
{
  _id: ObjectId,
  username: String (unique),
  password: String (hashed with bcrypt),
  createdAt: Date
}
```

#### 2. Portfolio Model (Single Document)
```javascript
{
  _id: ObjectId,
  personalInfo: {
    name: String,
    jobTitle: String,
    profilePicture: String (URL),
    coverPhoto: String (URL),
    aboutMe: String,
    email: String,
    phone: String,
    location: String
  },
  experience: [{
    _id: ObjectId,
    company: String,
    position: String,
    startDate: String,
    endDate: String,
    isCurrent: Boolean,
    description: String,
    responsibilities: [String]
  }],
  certifications: [{
    _id: ObjectId,
    name: String,
    issuingOrg: String,
    issueDate: String,
    credentialId: String
  }],
  skills: [{
    _id: ObjectId,
    name: String,
    level: Number (0-100)
  }],
  socialLinks: {
    linkedin: String,
    instagram: String,
    facebook: String,
    twitter: String
  },
  updatedAt: Date
}
```

#### 3. Documents Model
```javascript
{
  _id: ObjectId,
  resumePDF: {
    filename: String,
    path: String,
    uploadedAt: Date
  },
  resumeDOCX: {
    filename: String,
    path: String,
    uploadedAt: Date
  },
  coverLetterPDF: {
    filename: String,
    path: String,
    uploadedAt: Date
  },
  coverLetterDOCX: {
    filename: String,
    path: String,
    uploadedAt: Date
  }
}
```

## API Endpoints

### Public Endpoints (No Auth Required)

#### GET /api/portfolio
Get complete portfolio data
- Response: Portfolio object
- Status: 200 OK

#### GET /api/documents/download/:type
Download documents (resume-pdf, resume-docx, cover-letter-pdf, cover-letter-docx)
- Response: File download
- Status: 200 OK | 404 Not Found

### Authentication Endpoints

#### POST /api/auth/login
Admin login
- Body: { username, password }
- Response: { token, message }
- Status: 200 OK | 401 Unauthorized

#### POST /api/auth/verify
Verify JWT token
- Headers: Authorization: Bearer <token>
- Response: { valid: true/false }
- Status: 200 OK | 401 Unauthorized

### Protected Endpoints (Require Auth Token)

#### PUT /api/admin/portfolio/personal
Update personal information
- Headers: Authorization: Bearer <token>
- Body: { personalInfo object }
- Response: { success, message, data }
- Status: 200 OK | 401 Unauthorized

#### PUT /api/admin/portfolio/social-links
Update social links
- Headers: Authorization: Bearer <token>
- Body: { socialLinks object }
- Response: { success, message, data }
- Status: 200 OK

#### POST /api/admin/portfolio/experience
Add new experience
- Body: { experience object }
- Response: { success, message, data }
- Status: 201 Created

#### PUT /api/admin/portfolio/experience/:id
Update experience by ID
- Body: { experience object }
- Response: { success, message, data }
- Status: 200 OK

#### DELETE /api/admin/portfolio/experience/:id
Delete experience by ID
- Response: { success, message }
- Status: 200 OK

#### POST /api/admin/portfolio/certification
Add new certification
- Body: { certification object }
- Response: { success, message, data }
- Status: 201 Created

#### PUT /api/admin/portfolio/certification/:id
Update certification by ID
- Body: { certification object }
- Response: { success, message, data }
- Status: 200 OK

#### DELETE /api/admin/portfolio/certification/:id
Delete certification by ID
- Response: { success, message }
- Status: 200 OK

#### POST /api/admin/portfolio/skill
Add new skill
- Body: { skill object }
- Response: { success, message, data }
- Status: 201 Created

#### PUT /api/admin/portfolio/skill/:id
Update skill by ID
- Body: { skill object }
- Response: { success, message, data }
- Status: 200 OK

#### DELETE /api/admin/portfolio/skill/:id
Delete skill by ID
- Response: { success, message }
- Status: 200 OK

#### POST /api/admin/documents/upload
Upload documents (multipart/form-data)
- Body: FormData with files
- Fields: resumePDF, resumeDOCX, coverLetterPDF, coverLetterDOCX
- Response: { success, message, uploadedFiles }
- Status: 200 OK

## Frontend Integration Steps

### 1. Remove Mock Data
- Delete imports of `mockPortfolioData` from all components
- Remove `/app/frontend/src/mock.js` file

### 2. Create API Service Layer
Create `/app/frontend/src/services/api.js` with:
- Axios instance with baseURL
- Auth token management
- API methods for all endpoints

### 3. Update Components

#### Home.jsx
- Fetch portfolio data on mount using `GET /api/portfolio`
- Display fetched data instead of mock data
- Handle document downloads via API endpoints

#### AdminLogin.jsx
- Call `POST /api/auth/login` on form submit
- Store JWT token in localStorage
- Redirect to dashboard on success

#### AdminDashboard.jsx
- Add authentication check (verify token)
- Implement actual save functionality for all tabs
- Add file upload handling for documents
- Remove mock data, fetch real data from API
- Update data via PUT/POST/DELETE endpoints

### 4. Add Loading States
- Show loading spinners while fetching data
- Handle empty states gracefully

### 5. Error Handling
- Display user-friendly error messages
- Handle network errors
- Handle authentication errors (redirect to login)

## Security Considerations
- JWT tokens for authentication
- Password hashing with bcrypt (salt rounds: 10)
- File upload validation (size, type)
- Protected routes middleware
- CORS properly configured

## File Storage
- Documents stored in `/app/backend/uploads/` directory
- Organize by type: resumes/, cover-letters/
- Use unique filenames to prevent collisions

## Migration from Mock to Real Data
1. Backend creates default admin user (username: "admin", password: "admin123" - hashed)
2. Backend seeds initial portfolio data from mock.js structure
3. Frontend switches from mock imports to API calls
4. Test all CRUD operations
5. Verify file uploads work correctly
