# Production Environment Variables

## Required for Server

- `DATABASE_URL` - mongodb+srv://yashrajjagtap1910_db_user:Yashraj1910@cluster0.yasganc.mongodb.net/creator-platform-prod?appName=Cluster0
- `JWT_SECRET` - c7f3a9b2e8d4f1a6c0e5b3d7f2a8c4e9b1d6f0a3c8e2b5d9f4a7c1e6b0d3f8
- `NODE_ENV` - production
- `CLOUDINARY_CLOUD_NAME` - dgmmpwg8l
- `CLOUDINARY_API_KEY` - 894255955224392
- `CLOUDINARY_API_SECRET` - 7yzZhrf7h319FTvTRph3Z57Cx4M
- `FRONTEND_URL` - URL of deployed frontend (e.g., https://yourapp.vercel.app)

## Required for Client

- `VITE_API_BASE_URL` - URL of deployed backend (e.g., https://yourapp.onrender.com)

## Security Notes

- Never commit these values to Git
- Use platform environment variable settings (Render, Vercel dashboards)
- DATABASE_URL contains password - treat as highly sensitive
