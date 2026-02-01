# Environment Variables for Render Deployment

## Backend Service Environment Variables

Copy and paste these into your Render backend web service:

```
MONGO_URL=mongodb+srv://admin:admin123@cluster0.ktmc8py.mongodb.net/?retryWrites=true&w=majority

DB_NAME=portfolio_db

CORS_ORIGINS=*

JWT_SECRET_KEY=your-super-secret-jwt-key-please-change-this-in-production-use-random-string
```

**Important Notes:**
- Replace `CORS_ORIGINS=*` with your specific frontend URL after deployment for better security
- Change `JWT_SECRET_KEY` to a strong random string (at least 32 characters)
- Keep `MONGO_URL` exactly as shown (with your credentials)

---

## Frontend Service Environment Variables

Copy and paste these into your Render static site:

```
REACT_APP_BACKEND_URL=https://YOUR-BACKEND-URL.onrender.com
```

**Important Notes:**
- Replace `YOUR-BACKEND-URL` with your actual backend URL from Render
- Example: `https://portfolio-backend-abc123.onrender.com`
- Do NOT include trailing slash
- Do NOT include `/api` at the end

---

## How to Add Environment Variables in Render

### For Web Service (Backend):
1. Go to your service in Render dashboard
2. Click "Environment" in left sidebar
3. Click "Add Environment Variable"
4. Paste each variable (one at a time)
5. Click "Save Changes"

### For Static Site (Frontend):
1. Go to your static site in Render dashboard
2. Click "Environment" in left sidebar
3. Click "Add Environment Variable"
4. Paste the REACT_APP_BACKEND_URL variable
5. Click "Save Changes"

---

## After First Deployment

Once both services are deployed:

1. **Get your backend URL** (e.g., `https://portfolio-backend-xyz.onrender.com`)
2. **Update frontend environment variable:**
   - Replace `YOUR-BACKEND-URL` with actual URL
   - Save and redeploy

3. **Update backend CORS:**
   - Get your frontend URL (e.g., `https://portfolio-frontend-abc.onrender.com`)
   - Update `CORS_ORIGINS` to: `https://portfolio-frontend-abc.onrender.com`
   - Or keep as `*` for development (less secure)

---

## Production Security Recommendations

Before going live:

1. **Change Admin Password:**
   - Login to admin panel
   - Currently: username `admin`, password `admin123`
   - Update to strong password through admin panel or database

2. **Update JWT Secret:**
   ```
   JWT_SECRET_KEY=use-a-long-random-string-here-at-least-32-chars-like-this-one-xYz123456
   ```

3. **Restrict CORS:**
   ```
   CORS_ORIGINS=https://your-frontend-domain.com,https://www.your-domain.com
   ```

4. **MongoDB Atlas Security:**
   - Update IP whitelist to specific IPs (optional)
   - Use strong database password
   - Enable audit logs

---

## Testing Your Environment Variables

### Test Backend:
```bash
# Should return: {"message":"Portfolio API is running"}
curl https://your-backend-url.onrender.com/api/

# Should return portfolio data
curl https://your-backend-url.onrender.com/api/portfolio
```

### Test Frontend:
- Open browser console on your frontend URL
- Check for CORS errors
- Verify API calls show correct backend URL

---

## Common Issues

**Issue:** Frontend shows "Failed to fetch"
**Solution:** Check `REACT_APP_BACKEND_URL` is correct in frontend environment variables

**Issue:** CORS errors in browser
**Solution:** Update `CORS_ORIGINS` in backend to include frontend URL

**Issue:** MongoDB connection timeout
**Solution:** Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`

---

## Quick Copy-Paste Commands

Generate a secure JWT secret:
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

Your environment is ready! 🎉
