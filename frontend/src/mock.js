// Mock data for portfolio - will be replaced with backend integration
export const mockPortfolioData = {
  personalInfo: {
    name: "Rajesh Kumar",
    jobTitle: "Senior Analyst at Capgemini",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    coverPhoto: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=600&fit=crop",
    aboutMe: "Results-driven Senior Analyst with 5+ years of experience in business analysis, data analytics, and project management. Specialized in delivering data-driven insights and strategic solutions for Fortune 500 clients. Passionate about leveraging technology to solve complex business challenges.",
    email: "rajesh.kumar@email.com",
    phone: "+91 98765 43210",
    location: "Mumbai, India"
  },
  
  experience: [
    {
      id: 1,
      company: "Capgemini",
      position: "Senior Analyst",
      startDate: "Jan 2021",
      endDate: "Present",
      isCurrent: true,
      description: "Leading business analysis initiatives for global clients. Conducting data analysis, requirements gathering, and delivering strategic recommendations.",
      responsibilities: [
        "Lead cross-functional teams in analyzing business requirements",
        "Develop data-driven insights using SQL, Python, and Tableau",
        "Manage stakeholder communications and project deliverables"
      ]
    },
    {
      id: 2,
      company: "Accenture",
      position: "Business Analyst",
      startDate: "Jun 2019",
      endDate: "Dec 2020",
      isCurrent: false,
      description: "Performed business analysis and process optimization for financial services clients.",
      responsibilities: [
        "Conducted gap analysis and process mapping",
        "Created business requirement documents (BRD)",
        "Collaborated with development teams for solution implementation"
      ]
    }
  ],
  
  certifications: [
    {
      id: 1,
      name: "Certified Business Analysis Professional (CBAP)",
      issuingOrg: "IIBA",
      issueDate: "March 2022",
      credentialId: "CBAP-2022-45678"
    },
    {
      id: 2,
      name: "Microsoft Certified: Azure Data Fundamentals",
      issuingOrg: "Microsoft",
      issueDate: "September 2021",
      credentialId: "AZ-900-123456"
    },
    {
      id: 3,
      name: "Agile Certified Practitioner (PMI-ACP)",
      issuingOrg: "PMI",
      issueDate: "January 2021",
      credentialId: "PMI-ACP-789012"
    }
  ],
  
  skills: [
    { id: 1, name: "Business Analysis", level: 90 },
    { id: 2, name: "Data Analytics", level: 85 },
    { id: 3, name: "SQL & Database Management", level: 80 },
    { id: 4, name: "Python", level: 75 },
    { id: 5, name: "Tableau & Power BI", level: 85 },
    { id: 6, name: "Project Management", level: 80 },
    { id: 7, name: "Stakeholder Management", level: 90 },
    { id: 8, name: "Agile Methodologies", level: 85 }
  ],
  
  socialLinks: {
    linkedin: "https://linkedin.com/in/rajeshkumar",
    instagram: "https://instagram.com/rajeshkumar",
    facebook: "https://facebook.com/rajeshkumar",
    twitter: "https://twitter.com/rajeshkumar",
    github: ""
  },
  
  documents: {
    resumePDF: "/downloads/resume.pdf",
    resumeDOCX: "/downloads/resume.docx",
    coverLetterPDF: "/downloads/cover-letter.pdf",
    coverLetterDOCX: "/downloads/cover-letter.docx"
  }
};
