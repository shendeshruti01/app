import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Mail, Phone, MapPin, Linkedin, Instagram, Facebook, Twitter, Award, Briefcase, Code, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getPortfolio, downloadDocument } from '../services/api';
import { toast } from '@/hooks/use-toast';

const Home = () => {
  const navigate = useNavigate();
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchPortfolioData();
  }, []);
  
  const fetchPortfolioData = async () => {
    try {
      const data = await getPortfolio();
      setPortfolioData(data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      toast({
        title: "Error",
        description: "Failed to load portfolio data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownload = async (docType, filename) => {
    try {
      const blob = await downloadDocument(docType);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive"
      });
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-slate-600 mb-4" />
          <p className="text-slate-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }
  
  if (!portfolioData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Failed to load portfolio data</p>
        </div>
      </div>
    );
  }
  
  const { personalInfo, experience, certifications, skills, socialLinks } = portfolioData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header with Admin Login */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-transparent">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-end">
          <Button 
            variant="outline" 
            className="bg-white/90 hover:bg-white"
            onClick={() =>  = navigate('/admin/login')}
          >
            <Lock className="w-4 h-4 mr-2" />
            Admin Login
          </Button>
        </div>
      </div>

      {/* Cover Photo Section */}
      <div className="relative h-96 w-full overflow-hidden">
        <img 
          src={personalInfo.coverPhoto} 
          alt="Cover" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/30 to-slate-900/60" />
        
        {/* Profile Picture - Overlapping */}
        <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <img 
              src={personalInfo.profilePicture} 
              alt={personalInfo.name}
              className="w-40 h-40 rounded-full border-4 border-white shadow-xl object-cover"
            />
          </div>
        </div>
      </div>

      {/* Name & Job Title Section */}
      <div className="text-center mt-24 px-4">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">{personalInfo.name}</h1>
        <p className="text-xl text-slate-600 mb-4">{personalInfo.jobTitle}</p>
        
        {/* Contact Info */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600 mb-6">
          <div className="flex items-center gap-1">
            <Mail className="w-4 h-4" />
            <span>{personalInfo.email}</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="w-4 h-4" />
            <span>{personalInfo.phone}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{personalInfo.location}</span>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-3 mb-8">
          {socialLinks.linkedin && (
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" 
               className="p-2 rounded-full bg-slate-100 hover:bg-blue-600 hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          )}
          {socialLinks.instagram && (
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer"
               className="p-2 rounded-full bg-slate-100 hover:bg-pink-600 hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
          )}
          {socialLinks.facebook && (
            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer"
               className="p-2 rounded-full bg-slate-100 hover:bg-blue-700 hover:text-white transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
          )}
          {socialLinks.twitter && (
            <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer"
               className="p-2 rounded-full bg-slate-100 hover:bg-sky-500 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        
        {/* About Me Section */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            About Me
          </h2>
          <Card>
            <CardContent className="pt-6">
              <p className="text-slate-700 leading-relaxed text-lg">{personalInfo.aboutMe}</p>
            </CardContent>
          </Card>
        </section>

        {/* Experience Section */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Briefcase className="w-8 h-8" />
            Professional Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp) => (
              <Card key={exp.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{exp.position}</CardTitle>
                      <CardDescription className="text-base mt-1">
                        {exp.company} • {exp.startDate} - {exp.endDate}
                      </CardDescription>
                    </div>
                    {exp.isCurrent && (
                      <Badge className="bg-green-500">Current</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 mb-4">{exp.description}</p>
                  <div className="space-y-2">
                    <p className="font-semibold text-slate-900">Key Responsibilities:</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={idx}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Certifications Section */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Award className="w-8 h-8" />
            Certifications
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {certifications.map((cert) => (
              <Card key={cert.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{cert.name}</CardTitle>
                  <CardDescription>{cert.issuingOrg}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p><span className="font-semibold">Issued:</span> {cert.issueDate}</p>
                    <p><span className="font-semibold">Credential ID:</span> {cert.credentialId}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Areas of Expertise Section */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Code className="w-8 h-8" />
            Areas of Expertise
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6">
                {skills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-slate-900">{skill.name}</span>
                      <span className="text-sm text-slate-600">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Download Documents Section */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Download Documents</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-900 mb-3">Resume</h3>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleDownload('resume-pdf', 'resume.pdf')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleDownload('resume-docx', 'resume.docx')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download DOCX
                  </Button>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-900 mb-3">Cover Letter</h3>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleDownload('cover-letter-pdf', 'cover-letter.pdf')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleDownload('cover-letter-docx', 'cover-letter.docx')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download DOCX
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-slate-300">© 2024 {personalInfo.name}. All rights reserved.</p>
          <p className="text-slate-400 text-sm mt-2">Built with React & MongoDB</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
