# Deployment Guide - Vercel

## Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- Azure SQL Database with firewall configured

## Step-by-Step Deployment

### 1. Push Code to GitHub

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. **Import** your GitHub repository: `social-simulations`
4. Vercel will auto-detect the Vite configuration
5. **Don't deploy yet!** First, add environment variables

### 3. Configure Environment Variables

In Vercel project settings → **Environment Variables**, add:

| Name | Value |
|------|-------|
| `DB_SERVER` | `socialsimulation.database.windows.net` |
| `DB_DATABASE` | `socialsimulation` |
| `DB_USER` | `martinZust` |
| `DB_PASSWORD` | `zopyros12345mail.!2025!` |

**Important:** Add these to **all environments** (Production, Preview, Development)

### 4. Configure Azure Firewall for Vercel

Since Vercel uses dynamic IPs, you have two options:

#### Option A: Allow All Azure IPs (Recommended for Vercel)
1. Go to Azure Portal → SQL Server → Networking
2. Enable: **"Allow Azure services and resources to access this server"** → **YES**
3. This allows Vercel (hosted on Azure) to connect

#### Option B: Specific IP Ranges (More Restrictive)
Add Vercel's IP ranges from: https://vercel.com/docs/concepts/edge-network/regions

### 5. Deploy

1. Click **"Deploy"** in Vercel
2. Wait 2-3 minutes for build to complete
3. Vercel will give you a URL like: `https://your-app.vercel.app`

### 6. Test

1. Visit your Vercel URL
2. Run a simulation
3. When it completes, metrics will automatically save to Azure SQL

## Local Development vs Production

- **Local Dev**: Uses `http://localhost:3001/api/simulations` (Express server)
- **Production**: Uses `/api/simulations` (Vercel serverless function)

The app automatically detects the environment using `import.meta.env.DEV`

## Troubleshooting

### Database Connection Issues
- Verify environment variables are set in Vercel
- Check Azure firewall allows Azure services
- Check Vercel function logs: Project → Functions → View Logs

### Build Errors
- Make sure all dependencies are in `package.json`
- Check Vercel build logs for specific errors

## Update Deployment

Any push to `main` branch automatically triggers a new deployment on Vercel.

```bash
git add .
git commit -m "Your changes"
git push
```

## Architecture

```
User Browser
    ↓
Vercel CDN (Static React App)
    ↓
Vercel Serverless Function (/api/simulations)
    ↓
Azure SQL Database
```

## Files Added for Vercel

- `/api/simulations.js` - Serverless function (replaces Express server)
- `/vercel.json` - Vercel configuration
- `/DEPLOYMENT.md` - This file

## Cost

- **Vercel**: Free tier (sufficient for this project)
- **Azure SQL**: Depends on your tier (Basic ~$5/month)
