# Deployment Guide

Your application has two parts:
1.  **Frontend** (Next.js) - Currently deployed on Vercel.
2.  **Backend** (Node.js/Express) - Currently only on your computer.

**The frontend on Vercel cannot talk to the backend on your computer.** You must deploy the backend to the cloud so they can communicate.

## Step 1: Deploy the Backend (Recommended: Render)

Render is a cloud provider that is easy to use for Node.js apps.

1.  **Sign up/Login** to [render.com](https://render.com).
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub account and select your repository: `Shadow-mesh`.
4.  **Configure the Service**:
    *   **Name**: `shadowmesh-backend`
    *   **Root Directory**: `backend` (Important!)
    *   **Environment**: `Node`
    *   **Build Command**: `npm install && npm run build`
    *   **Start Command**: `npm start`
5.  **Environment Variables** (Scroll down to "Environment Variables"):
    *   Key: `PORT` | Value: `3002` (or leave empty, Render assigns one automatically)
    *   Key: `PRIVATE_KEY` | Value: `Your_Real_Private_Key_Here` (The one you added to .env locally)
6.  Click **Create Web Service**.

Wait for the deployment to finish. Render will give you a URL like `https://shadowmesh-backend.onrender.com`. **Copy this URL.**

## Step 2: Connect Frontend to Backend

Now you need to tell your Vercel frontend where the backend lives.

1.  Go to your **Vercel Dashboard** and open your project.
2.  Go to **Settings** > **Environment Variables**.
3.  Add a new variable:
    *   **Key**: `NEXT_PUBLIC_API_URL`
    *   **Value**: The Render URL you copied (e.g., `https://shadowmesh-backend.onrender.com`)
    *   *Note: Do not add a trailing slash `/` at the end.*
4.  Click **Save**.

## Step 3: Redeploy Frontend

For the new environment variable to take effect, you must redeploy.

1.  Go to the **Deployments** tab in Vercel.
2.  Click the **three dots** (...) next to your latest deployment.
3.  Select **Redeploy**.

## Step 4: Verify

Once the frontend redeploys:
1.  Open your Vercel app URL.
2.  Try a command like "Help" or "Check Balance".
3.  It should now receive a response from your live backend!
