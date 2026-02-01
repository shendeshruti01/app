#!/usr/bin/env python3
"""
Portfolio Backend API Test Suite
Tests all backend endpoints for the portfolio application
"""

import requests
import json
import os
from datetime import datetime
import uuid

# Get backend URL from environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'https://admin-portfolio-15.preview.emergentagent.com')
API_BASE = f"{BACKEND_URL}/api"

class PortfolioAPITester:
    def __init__(self):
        self.jwt_token = None
        self.test_results = []
        self.added_skill_id = None
        
    def log_test(self, test_name, success, message, response_data=None):
        """Log test results"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat()
        }
        if response_data:
            result['response'] = response_data
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        
    def test_health_check(self):
        """Test GET /api/ - Health check"""
        try:
            response = requests.get(f"{API_BASE}/", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "running" in data["message"]:
                    self.log_test("Health Check", True, "API is running successfully", data)
                    return True
                else:
                    self.log_test("Health Check", False, f"Unexpected response format: {data}")
                    return False
            else:
                self.log_test("Health Check", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Health Check", False, f"Connection error: {str(e)}")
            return False
    
    def test_get_portfolio(self):
        """Test GET /api/portfolio - Fetch portfolio data"""
        try:
            response = requests.get(f"{API_BASE}/portfolio", timeout=10)
            if response.status_code == 200:
                data = response.json()
                # Verify expected portfolio structure
                required_fields = ['personalInfo', 'experience', 'certifications', 'skills', 'socialLinks']
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    # Verify personal info has required fields
                    personal_info = data.get('personalInfo', {})
                    required_personal = ['name', 'jobTitle', 'email', 'phone', 'location']
                    missing_personal = [field for field in required_personal if field not in personal_info]
                    
                    if not missing_personal:
                        self.log_test("Get Portfolio", True, f"Portfolio data retrieved successfully. Name: {personal_info.get('name')}")
                        return True
                    else:
                        self.log_test("Get Portfolio", False, f"Missing personal info fields: {missing_personal}")
                        return False
                else:
                    self.log_test("Get Portfolio", False, f"Missing portfolio fields: {missing_fields}")
                    return False
            else:
                self.log_test("Get Portfolio", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Get Portfolio", False, f"Request error: {str(e)}")
            return False
    
    def test_document_download(self):
        """Test GET /api/documents/download/resume-pdf - Document download"""
        try:
            response = requests.get(f"{API_BASE}/documents/download/resume-pdf", timeout=10)
            # Expecting 404 since no documents are uploaded yet
            if response.status_code == 404:
                self.log_test("Document Download", True, "Correctly returns 404 for non-existent document")
                return True
            elif response.status_code == 200:
                self.log_test("Document Download", True, "Document found and downloadable")
                return True
            else:
                self.log_test("Document Download", False, f"Unexpected HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Document Download", False, f"Request error: {str(e)}")
            return False
    
    def test_login(self):
        """Test POST /api/auth/login - Admin login"""
        try:
            login_data = {
                "username": "admin",
                "password": "admin123"
            }
            response = requests.post(f"{API_BASE}/auth/login", json=login_data, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "token" in data and "message" in data:
                    self.jwt_token = data["token"]
                    self.log_test("Admin Login", True, f"Login successful: {data['message']}")
                    return True
                else:
                    self.log_test("Admin Login", False, f"Missing token or message in response: {data}")
                    return False
            else:
                self.log_test("Admin Login", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Admin Login", False, f"Request error: {str(e)}")
            return False
    
    def test_verify_token(self):
        """Test POST /api/auth/verify - Verify JWT token"""
        if not self.jwt_token:
            self.log_test("Token Verification", False, "No JWT token available for verification")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.jwt_token}"}
            response = requests.post(f"{API_BASE}/auth/verify", headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("valid") is True and "username" in data:
                    self.log_test("Token Verification", True, f"Token verified for user: {data['username']}")
                    return True
                else:
                    self.log_test("Token Verification", False, f"Invalid verification response: {data}")
                    return False
            else:
                self.log_test("Token Verification", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Token Verification", False, f"Request error: {str(e)}")
            return False
    
    def test_update_personal_info(self):
        """Test PUT /api/admin/portfolio/personal - Update personal info"""
        if not self.jwt_token:
            self.log_test("Update Personal Info", False, "No JWT token available")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.jwt_token}"}
            test_data = {
                "name": "Rajesh Kumar (Updated)",
                "jobTitle": "Senior Business Analyst at Capgemini",
                "profilePicture": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
                "coverPhoto": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=600&fit=crop",
                "aboutMe": "Updated: Results-driven Senior Analyst with 5+ years of experience in business analysis, data analytics, and project management.",
                "email": "rajesh.kumar.updated@email.com",
                "phone": "+91 98765 43211",
                "location": "Mumbai, Maharashtra, India"
            }
            
            response = requests.put(f"{API_BASE}/admin/portfolio/personal", json=test_data, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") is True:
                    self.log_test("Update Personal Info", True, f"Personal info updated: {data.get('message')}")
                    return True
                else:
                    self.log_test("Update Personal Info", False, f"Update failed: {data}")
                    return False
            else:
                self.log_test("Update Personal Info", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Update Personal Info", False, f"Request error: {str(e)}")
            return False
    
    def test_update_social_links(self):
        """Test PUT /api/admin/portfolio/social-links - Update social links"""
        if not self.jwt_token:
            self.log_test("Update Social Links", False, "No JWT token available")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.jwt_token}"}
            test_data = {
                "linkedin": "https://linkedin.com/in/rajeshkumar-updated",
                "instagram": "https://instagram.com/rajeshkumar_updated",
                "facebook": "https://facebook.com/rajeshkumar.updated",
                "twitter": "https://twitter.com/rajeshkumar_up"
            }
            
            response = requests.put(f"{API_BASE}/admin/portfolio/social-links", json=test_data, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") is True:
                    self.log_test("Update Social Links", True, f"Social links updated: {data.get('message')}")
                    return True
                else:
                    self.log_test("Update Social Links", False, f"Update failed: {data}")
                    return False
            else:
                self.log_test("Update Social Links", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Update Social Links", False, f"Request error: {str(e)}")
            return False
    
    def test_add_skill(self):
        """Test POST /api/admin/portfolio/skill - Add a new skill"""
        if not self.jwt_token:
            self.log_test("Add Skill", False, "No JWT token available")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.jwt_token}"}
            test_data = {
                "name": "API Testing",
                "level": 95
            }
            
            response = requests.post(f"{API_BASE}/admin/portfolio/skill", json=test_data, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") is True and "data" in data:
                    skill_data = data["data"]
                    self.added_skill_id = skill_data.get("id")
                    self.log_test("Add Skill", True, f"Skill added: {skill_data.get('name')} (ID: {self.added_skill_id})")
                    return True
                else:
                    self.log_test("Add Skill", False, f"Add failed: {data}")
                    return False
            else:
                self.log_test("Add Skill", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Add Skill", False, f"Request error: {str(e)}")
            return False
    
    def test_delete_skill(self):
        """Test DELETE /api/admin/portfolio/skill/{skill_id} - Delete the newly added skill"""
        if not self.jwt_token:
            self.log_test("Delete Skill", False, "No JWT token available")
            return False
            
        if not self.added_skill_id:
            self.log_test("Delete Skill", False, "No skill ID available for deletion")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.jwt_token}"}
            response = requests.delete(f"{API_BASE}/admin/portfolio/skill/{self.added_skill_id}", headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") is True:
                    self.log_test("Delete Skill", True, f"Skill deleted: {data.get('message')}")
                    return True
                else:
                    self.log_test("Delete Skill", False, f"Delete failed: {data}")
                    return False
            else:
                self.log_test("Delete Skill", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Delete Skill", False, f"Request error: {str(e)}")
            return False
    
    def test_verify_data_persistence(self):
        """Test GET /api/portfolio again to confirm changes were saved"""
        try:
            response = requests.get(f"{API_BASE}/portfolio", timeout=10)
            if response.status_code == 200:
                data = response.json()
                personal_info = data.get('personalInfo', {})
                
                # Check if our updates persisted
                if personal_info.get('name') == "Rajesh Kumar (Updated)":
                    self.log_test("Data Persistence", True, "Personal info changes persisted successfully")
                    
                    # Check social links
                    social_links = data.get('socialLinks', {})
                    if social_links.get('linkedin') == "https://linkedin.com/in/rajeshkumar-updated":
                        self.log_test("Social Links Persistence", True, "Social links changes persisted successfully")
                        return True
                    else:
                        self.log_test("Social Links Persistence", False, f"Social links not updated: {social_links}")
                        return False
                else:
                    self.log_test("Data Persistence", False, f"Personal info changes not persisted. Name: {personal_info.get('name')}")
                    return False
            else:
                self.log_test("Data Persistence", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Data Persistence", False, f"Request error: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print(f"🚀 Starting Portfolio Backend API Tests")
        print(f"📍 Backend URL: {API_BASE}")
        print("=" * 60)
        
        # Public endpoints
        print("\n📋 Testing Public Endpoints:")
        self.test_health_check()
        self.test_get_portfolio()
        self.test_document_download()
        
        # Authentication
        print("\n🔐 Testing Authentication:")
        login_success = self.test_login()
        if login_success:
            self.test_verify_token()
        
        # Protected endpoints (only if login succeeded)
        if self.jwt_token:
            print("\n🛡️ Testing Protected Admin Endpoints:")
            self.test_update_personal_info()
            self.test_update_social_links()
            skill_added = self.test_add_skill()
            if skill_added:
                self.test_delete_skill()
            
            # Data persistence verification
            print("\n💾 Testing Data Persistence:")
            self.test_verify_data_persistence()
        else:
            print("\n❌ Skipping protected endpoint tests - authentication failed")
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY:")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)
        
        print(f"✅ Passed: {passed}/{total}")
        print(f"❌ Failed: {total - passed}/{total}")
        
        if total - passed > 0:
            print("\n🔍 Failed Tests:")
            for result in self.test_results:
                if not result['success']:
                    print(f"   • {result['test']}: {result['message']}")
        
        return passed == total

if __name__ == "__main__":
    tester = PortfolioAPITester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed!")
        exit(0)
    else:
        print("\n💥 Some tests failed!")
        exit(1)