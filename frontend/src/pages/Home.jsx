import React from 'react';
import { Download, Mail, Phone, MapPin, Linkedin, Instagram, Facebook, Twitter, ExternalLink, Award, Briefcase, Code } from 'lucide-react';
import { mockPortfolioData } from '../mock';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Progress } from '../components/ui/progress';

const Home = () => {
  const { personalInfo, experience, certifications, skills, socialLinks, documents } = mockPortfolioData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
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
                  <Button className="w-full" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download DOCX
                  </Button>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-900 mb-3">Cover Letter</h3>
                  <Button className="w-full" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button className="w-full" variant="outline">
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
