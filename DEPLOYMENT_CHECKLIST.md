# Quick Deployment Checklist for Render.com

## Pre-Deployment (5 minutes)

- [ ] Create Render.com account: https://render.com
- [ ] Ensure MongoDB Atlas IP whitelist allows all IPs (`0.0.0.0/0`)
- [ ] (Optional) Push code to GitHub

---

## Backend Deployment (8 minutes)

### On Render Dashboard:

1. **Create New Web Service**
   - New + → Web Service
   - Connect repository or use Git URL

2. **Settings:**
   ```
   Name: portfolio-backend
   Root Directory: backend
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn server:app --host 0.0.0.0 --port $PORT
   ```

3. **Environment Variables:**
   ```
   MONGO_URL=mongodb+srv://admin:admin123@cluster0.ktmc8py.mongodb.net/?retryWrites=true&w=majority
   DB_NAME=portfolio_db
   CORS_ORIGINS=*
   JWT_SECRET_KEY=change-this-secret-key-in-production
   ```

4. **Deploy** → Copy backend URL (e.g., `https://portfolio-backend-xxxx.onrender.com`)

---

## Frontend Deployment (5 minutes)

### On Render Dashboard:

1. **Create New Static Site**
   - New + → Static Site
   - Connect same repository

2. **Settings:**
   ```
   Name: portfolio-frontend
   Root Directory: frontend
   Build Command: yarn install && yarn build
   Publish Directory: build
   ```

3. **Environment Variables:**
   ```
   REACT_APP_BACKEND_URL=https://portfolio-backend-xxxx.onrender.com
   ```
   *(Replace with YOUR backend URL from step above)*

4. **Deploy** → Copy frontend URL

---

## Final Configuration (2 minutes)

1. **Update Backend CORS:**
   - Go to backend service → Environment
   - Update `CORS_ORIGINS` to: `https://your-frontend-url.onrender.com`
   - Save (auto-redeploys)

2. **Test Deployment:**
   - Visit frontend URL
   - Login: username `admin`, password `admin123`
   - Upload test document
   - Verify download works

---

## ✅ Done!

Your portfolio is now live at: `https://your-frontend-url.onrender.com`

**Next Steps:**
- Set up custom domain (optional)
- Change admin password
- Configure cloud storage for files (recommended)

---

## Quick Troubleshooting

**Backend not starting?**
- Check logs in Render dashboard
- Verify MongoDB connection string

**Frontend can't reach backend?**
- Check REACT_APP_BACKEND_URL is correct
- Verify CORS_ORIGINS includes frontend URL

**Files not uploading?**
- Free tier has ephemeral storage
- Consider upgrading or using cloud storage

---

## Support

Full guide: `/app/DEPLOYMENT_GUIDE.md`
Render docs: https://render.com/docs
