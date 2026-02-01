# Portfolio Website Deployment Guide for Render.com

## Prerequisites

1. **Render.com Account**
   - Sign up at https://render.com (free tier available)
   - Connect your GitHub account (recommended)

2. **GitHub Repository** (Recommended)
   - Push your code to GitHub
   - Or use Render's direct Git integration

3. **MongoDB Atlas** (Already Set Up)
   - Your connection string: `mongodb+srv://admin:admin123@cluster0.ktmc8py.mongodb.net`
   - Database: `portfolio_db`
   - IP Whitelist: Set to `0.0.0.0/0` (allow all IPs) or add Render's IPs

---

## Deployment Steps

### Step 1: Prepare Your Code Repository

If using GitHub (recommended):

```bash
# Initialize git if not already done
cd /app
git init
git add .
git commit -m "Initial portfolio website commit"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 2: Deploy Backend (FastAPI) on Render

1. **Log in to Render Dashboard**
   - Go to https://dashboard.render.com

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository (or use manual Git URL)
   - Select your repository

3. **Configure Backend Service**
   ```
   Name: portfolio-backend (or your preferred name)
   Region: Choose closest to your users
   Branch: main (or your default branch)
   Root Directory: backend
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn server:app --host 0.0.0.0 --port $PORT
   Instance Type: Free (or upgrade as needed)
   ```

4. **Add Environment Variables**
   - Click "Advanced" → "Add Environment Variable"
   - Add these variables:
   ```
   MONGO_URL = mongodb+srv://admin:admin123@cluster0.ktmc8py.mongodb.net/?retryWrites=true&w=majority
   DB_NAME = portfolio_db
   CORS_ORIGINS = *
   JWT_SECRET_KEY = your-super-secret-jwt-key-change-this-in-production
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (takes 3-5 minutes)
   - Note your backend URL: `https://portfolio-backend-xxxx.onrender.com`

### Step 3: Deploy Frontend (React) on Render

1. **Create New Static Site**
   - Click "New +" → "Static Site"
   - Connect the same repository

2. **Configure Frontend Service**
   ```
   Name: portfolio-frontend (or your preferred name)
   Branch: main
   Root Directory: frontend
   Build Command: yarn install && yarn build
   Publish Directory: build
   ```

3. **Add Environment Variables**
   - Click "Advanced" → "Add Environment Variable"
   ```
   REACT_APP_BACKEND_URL = https://portfolio-backend-xxxx.onrender.com
   ```
   (Replace with your actual backend URL from Step 2)

4. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment (takes 2-4 minutes)
   - Your portfolio URL: `https://portfolio-frontend-xxxx.onrender.com`

### Step 4: Update CORS Settings

After getting your frontend URL, update backend CORS:

1. Go to your backend service in Render
2. Update the `CORS_ORIGINS` environment variable:
   ```
   CORS_ORIGINS = https://portfolio-frontend-xxxx.onrender.com,https://your-custom-domain.com
   ```
   (Replace with your actual frontend URL)
3. Click "Save Changes" - Backend will redeploy automatically

---

## Alternative: Deploy Both as Single Service

If you want both frontend and backend in one service:

1. **Create New Web Service**
2. **Configure:**
   ```
   Root Directory: /
   Build Command: cd backend && pip install -r requirements.txt && cd ../frontend && yarn install && yarn build
   Start Command: cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT
   ```
3. **Serve Frontend from Backend:**
   - Add static file serving in `server.py` (requires additional configuration)

---

## Post-Deployment Configuration

### 1. Test Backend API
```bash
curl https://portfolio-backend-xxxx.onrender.com/api/
# Should return: {"message":"Portfolio API is running"}

curl https://portfolio-backend-xxxx.onrender.com/api/portfolio
# Should return your portfolio data
```

### 2. Test Frontend
- Visit: `https://portfolio-frontend-xxxx.onrender.com`
- Verify portfolio loads correctly
- Test admin login: username `admin`, password `admin123`
- Upload test documents in admin panel
- Verify downloads work on homepage

### 3. MongoDB Atlas Final Check
- Ensure IP whitelist includes `0.0.0.0/0` OR Render's IP ranges
- Verify database user has `readWrite` permissions

---

## Custom Domain Setup (Optional)

### For Frontend (Static Site):
1. Go to your frontend service in Render
2. Click "Settings" → "Custom Domain"
3. Add your domain: `www.yourportfolio.com`
4. Update DNS records as instructed by Render
5. SSL certificate auto-provisioned by Render

### For Backend (Web Service):
1. Go to your backend service
2. Click "Settings" → "Custom Domain"
3. Add API subdomain: `api.yourportfolio.com`
4. Update DNS records
5. Update frontend `REACT_APP_BACKEND_URL` to use custom domain

---

## File Upload Considerations on Render

⚠️ **Important:** Render's free tier uses ephemeral storage. Uploaded files will be deleted when the service restarts.

**Solutions:**

### Option 1: Use Cloud Storage (Recommended for Production)
- AWS S3
- Google Cloud Storage
- Cloudinary
- Update backend to store files in cloud storage

### Option 2: Upgrade to Render Disk
- Upgrade to paid plan with persistent disk
- Add disk in service settings

### Option 3: Store Files in MongoDB GridFS
- Store small files directly in MongoDB
- Suitable for documents under 16MB

---

## Troubleshooting

### Backend Issues:

**Problem:** Backend fails to start
```
Solution: Check logs in Render dashboard
- Verify all environment variables are set
- Ensure requirements.txt is up to date
- Check MongoDB connection string
```

**Problem:** MongoDB connection timeout
```
Solution: 
- Verify IP whitelist in MongoDB Atlas
- Add 0.0.0.0/0 to allow all IPs
- Check MONGO_URL format
```

### Frontend Issues:

**Problem:** API calls fail (CORS errors)
```
Solution:
- Verify REACT_APP_BACKEND_URL is correct
- Update backend CORS_ORIGINS to include frontend URL
- Check browser console for exact error
```

**Problem:** Environment variables not loading
```
Solution:
- Environment variables must start with REACT_APP_
- Redeploy after changing environment variables
- Clear browser cache
```

---

## Monitoring & Maintenance

### View Logs:
- Go to service in Render dashboard
- Click "Logs" tab
- Monitor for errors

### Auto-Deploy on Git Push:
- Render auto-deploys when you push to connected branch
- Disable auto-deploy in Settings if needed

### Free Tier Limitations:
- Services sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- Upgrade to paid plan to prevent sleeping

---

## Estimated Deployment Time

- Backend deployment: **5-8 minutes**
- Frontend deployment: **3-5 minutes**
- Total setup time: **15-20 minutes**

---

## Production Checklist

Before going live:

- [ ] Change admin password from default `admin123`
- [ ] Update JWT_SECRET_KEY to a strong secret
- [ ] Configure custom domain
- [ ] Set up cloud storage for file uploads
- [ ] Enable HTTPS (automatic on Render)
- [ ] Test all features in production
- [ ] Set up monitoring/alerts
- [ ] Update MongoDB Atlas IP whitelist to specific IPs (optional)
- [ ] Add proper error pages (404, 500)
- [ ] Configure backup strategy for MongoDB

---

## Support & Resources

- Render Documentation: https://render.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- React Deployment: https://create-react-app.dev/docs/deployment/

---

## Quick Deploy Commands

```bash
# If using Render CLI (optional)
npm install -g render-cli
render login
render deploy
```

---

## Your Current Setup

**MongoDB Atlas:**
- Connection: `mongodb+srv://admin:admin123@cluster0.ktmc8py.mongodb.net`
- Database: `portfolio_db`
- Collections: `admin`, `portfolio`, `documents`

**Admin Credentials:**
- Username: `admin`
- Password: `admin123` (⚠️ Change in production!)

**Features Ready:**
- Portfolio display with all sections
- Admin panel with authentication
- File upload/download (Resume & Cover Letter)
- Responsive design
- MongoDB integration

---

Good luck with your deployment! 🚀
