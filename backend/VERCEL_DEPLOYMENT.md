# Environment Variables for Vercel

## Required Variables
Add these in your Vercel project settings (Settings → Environment Variables):

### Database
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sih?retryWrites=true&w=majority
```

### JWT Configuration
```
JWT_SECRET=your-super-secure-secret-key-change-this
JWT_EXPIRE=7d
```

### AWS S3 (Optional - if using file uploads)
```
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-bucket-name
```

### Server Configuration
```
NODE_ENV=production
PORT=5000
```

## Deployment Steps

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from backend directory**
   ```bash
   cd backend
   vercel
   ```

4. **Set Environment Variables**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all required variables listed above
   - Make sure to add them for Production, Preview, and Development

5. **Redeploy** (after adding env variables)
   ```bash
   vercel --prod
   ```

## Important Notes

- ✅ MongoDB connection must be from a cloud provider (MongoDB Atlas recommended)
- ✅ JWT_SECRET should be a strong random string in production
- ✅ Make sure MongoDB Atlas allows connections from anywhere (0.0.0.0/0) or add Vercel IPs
- ✅ CORS is enabled for all origins - configure it properly for production
- ✅ All routes will be accessible via: `https://your-project.vercel.app/api/...`

## Test Deployment

```bash
# Health check
curl https://your-project.vercel.app/

# Login
curl -X POST https://your-project.vercel.app/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```
