import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Save, Plus, Trash2, User, Briefcase, Award, Code, Link as LinkIcon, FileText, Image, Upload } from 'lucide-react';
import { mockPortfolioData } from '../mock';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [portfolioData, setPortfolioData] = useState(mockPortfolioData);

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleSave = (section) => {
    // Mock save - will be replaced with backend API
    toast({
      title: "Success",
      description: `${section} updated successfully!`,
    });
  };

  const updatePersonalInfo = (field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const updateSocialLinks = (field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [field]: value }
    }));
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
      responsibilities: ['']
    };
    setPortfolioData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  const deleteExperience = (id) => {
    setPortfolioData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addCertification = () => {
    const newCert = {
      id: Date.now(),
      name: '',
      issuingOrg: '',
      issueDate: '',
      credentialId: ''
    };
    setPortfolioData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCert]
    }));
  };

  const deleteCertification = (id) => {
    setPortfolioData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id)
    }));
  };

  const addSkill = () => {
    const newSkill = {
      id: Date.now(),
      name: '',
      level: 50
    };
    setPortfolioData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const deleteSkill = (id) => {
    setPortfolioData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => window.open('/', '_blank')}>
              View Portfolio
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={portfolioData.personalInfo.name}
                      onChange={(e) => updatePersonalInfo('name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      value={portfolioData.personalInfo.jobTitle}
                      onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aboutMe">About Me</Label>
                  <Textarea
                    id="aboutMe"
                    rows={5}
                    value={portfolioData.personalInfo.aboutMe}
                    onChange={(e) => updatePersonalInfo('aboutMe', e.target.value)}
                  />
                </div>

                <Separator />

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={portfolioData.personalInfo.email}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={portfolioData.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={portfolioData.personalInfo.location}
                      onChange={(e) => updatePersonalInfo('location', e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Profile Images
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Profile Picture URL</Label>
                      <Input
                        value={portfolioData.personalInfo.profilePicture}
                        onChange={(e) => updatePersonalInfo('profilePicture', e.target.value)}
                        placeholder="Enter image URL"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cover Photo URL</Label>
                      <Input
                        value={portfolioData.personalInfo.coverPhoto}
                        onChange={(e) => updatePersonalInfo('coverPhoto', e.target.value)}
                        placeholder="Enter image URL"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    Social Links
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>LinkedIn URL</Label>
                      <Input
                        value={portfolioData.socialLinks.linkedin}
                        onChange={(e) => updateSocialLinks('linkedin', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Instagram URL</Label>
                      <Input
                        value={portfolioData.socialLinks.instagram}
                        onChange={(e) => updateSocialLinks('instagram', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Facebook URL</Label>
                      <Input
                        value={portfolioData.socialLinks.facebook}
                        onChange={(e) => updateSocialLinks('facebook', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Twitter URL</Label>
                      <Input
                        value={portfolioData.socialLinks.twitter}
                        onChange={(e) => updateSocialLinks('twitter', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSave('Personal Information')} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      Experience
                    </CardTitle>
                    <CardDescription>Manage your professional experience</CardDescription>
                  </div>
                  <Button onClick={addExperience}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {portfolioData.experience.map((exp, index) => (
                  <Card key={exp.id} className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-semibold">Experience #{index + 1}</h4>
                      <Button variant="destructive" size="sm" onClick={() => deleteExperience(exp.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input placeholder="Company" defaultValue={exp.company} />
                      <Input placeholder="Position" defaultValue={exp.position} />
                      <Input placeholder="Start Date" defaultValue={exp.startDate} />
                      <Input placeholder="End Date" defaultValue={exp.endDate} />
                    </div>
                    <Textarea className="mt-4" rows={3} placeholder="Description" defaultValue={exp.description} />
                  </Card>
                ))}
                <Button onClick={() => handleSave('Experience')} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save All Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certifications Tab */}
          <TabsContent value="certifications">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Certifications
                    </CardTitle>
                    <CardDescription>Manage your certifications</CardDescription>
                  </div>
                  <Button onClick={addCertification}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Certification
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {portfolioData.certifications.map((cert, index) => (
                  <Card key={cert.id} className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-semibold">Certification #{index + 1}</h4>
                      <Button variant="destructive" size="sm" onClick={() => deleteCertification(cert.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid gap-4">
                      <Input placeholder="Certification Name" defaultValue={cert.name} />
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input placeholder="Issuing Organization" defaultValue={cert.issuingOrg} />
                        <Input placeholder="Issue Date" defaultValue={cert.issueDate} />
                      </div>
                      <Input placeholder="Credential ID" defaultValue={cert.credentialId} />
                    </div>
                  </Card>
                ))}
                <Button onClick={() => handleSave('Certifications')} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save All Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      Areas of Expertise
                    </CardTitle>
                    <CardDescription>Manage your skills and expertise levels</CardDescription>
                  </div>
                  <Button onClick={addSkill}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {portfolioData.skills.map((skill, index) => (
                  <Card key={skill.id} className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-semibold">Skill #{index + 1}</h4>
                      <Button variant="destructive" size="sm" onClick={() => deleteSkill(skill.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input placeholder="Skill Name" defaultValue={skill.name} />
                      <Input type="number" min="0" max="100" placeholder="Level (0-100)" defaultValue={skill.level} />
                    </div>
                  </Card>
                ))}
                <Button onClick={() => handleSave('Skills')} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save All Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Documents
                </CardTitle>
                <CardDescription>Upload and manage your resume and cover letter</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Resume</h3>
                    <div className="space-y-3">
                      <div>
                        <Label>Upload PDF</Label>
                        <Input type="file" accept=".pdf" className="mt-2" />
                      </div>
                      <div>
                        <Label>Upload DOCX</Label>
                        <Input type="file" accept=".docx" className="mt-2" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold">Cover Letter</h3>
                    <div className="space-y-3">
                      <div>
                        <Label>Upload PDF</Label>
                        <Input type="file" accept=".pdf" className="mt-2" />
                      </div>
                      <div>
                        <Label>Upload DOCX</Label>
                        <Input type="file" accept=".docx" className="mt-2" />
                      </div>
                    </div>
                  </div>
                </div>
                <Button onClick={() => handleSave('Documents')} className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Documents
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
