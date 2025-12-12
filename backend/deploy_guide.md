# Deployment Guide for ShadowMesh Backend

This guide provides instructions for deploying the ShadowMesh backend to **free** and **reliable** platforms, avoiding restrictive services like Render/Heroku.

## Option 1: Koyeb (Recommended for Ease of Use)
**Koyeb** offers a generous "Free Forever" tier that supports Docker and Node.js with no credit card required for basic usage.

### Steps:
1.  **Push to GitHub**: Ensure your code is in a GitHub repository.
2.  **Sign Up**: Go to [koyeb.com](https://www.koyeb.com/) and login with GitHub.
3.  **Create App**:
    *   Click "Create App".
    *   Select "GitHub" as the deployment method.
    *   Select your repository (`ShadowMesh`).
4.  **Configuration**:
    *   **Builder**: Node.js
    *   **Build Command**: `npm install && npm run build` (Ensure you have a build script or use `npm install` if just running `ts-node`).
    *   **Run Command**: `npm start` (Make sure `package.json` has `"start": "ts-node src/index.ts"`).
    *   **Environment Variables**: Add `PRIVATE_KEY` (if you have one) and `PORT` (set to `8000` or leave blank, Koyeb detects it).
5.  **Deploy**: Click "Deploy". Koyeb will build and launch your service. You will get a URL like `https://shadowmesh-backend-yourname.koyeb.app`.

## Option 2: Oracle Cloud "Always Free" (Recommended for Power Users)
**Oracle Cloud** provides a very powerful free tier (ARM Ampere instances with 4 OCPUs and 24GB RAM). This is a full Virtual Private Server (VPS), not just a container host.

### Steps:
1.  **Sign Up**: Create an Oracle Cloud Free Tier account.
2.  **Create Instance**:
    *   Go to "Compute" -> "Instances".
    *   Create a new instance using the **Ampere (ARM)** shape.
    *   Select **Ubuntu** as the OS.
3.  **Setup Server**:
    *   SSH into your new IP.
    *   Install Node.js:
        ```bash
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
        ```
    *   Install Git: `sudo apt install git`
4.  **Deploy**:
    *   Clone your repo: `git clone https://github.com/your/repo.git`
    *   `cd shadowmesh/backend`
    *   `npm install`
    *   `npm install -g pm2` (Process Manager)
    *   `pm2 start src/index.ts --interpreter ./node_modules/.bin/ts-node --name shadowmesh-backend`
5.  **Expose Port**:
    *   In Oracle Cloud Console -> Networking -> Security Lists, allow Ingress on port `3002`.
    *   On the server: `sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3002 -j ACCEPT`

## Option 3: Local + Ngrok (Best for Hackathon Demos)
If you just need to show it working "live" from your laptop during a demo:

1.  **Install Ngrok**: [Download Ngrok](https://ngrok.com/download).
2.  **Start Backend**:
    ```bash
    cd backend
    npm run dev
    ```
3.  **Expose Port**:
    ```bash
    ngrok http 3002
    ```
4.  **Use URL**: Ngrok will give you an `https://....ngrok-free.app` URL. Use this in your Frontend `.env` file (`NEXT_PUBLIC_API_URL`).

## Testing the Deployment
Once deployed, verify it works by visiting:
`https://<your-url>/health`
You should see: `{"status":"ok","service":"Shadowmesh Backend"}`
