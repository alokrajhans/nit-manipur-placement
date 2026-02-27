#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 NIT Placement - GitHub Webhook Setup${NC}\n"

# Check if .env exists
if [ ! -f "server/.env" ]; then
    echo -e "${YELLOW}⚠️  No .env file found. Creating from template...${NC}"
    cp server/.env.example server/.env
    echo -e "${RED}❌ Please update server/.env with your credentials:${NC}"
    echo "   - GEMINI_API_KEY"
    echo "   - GITHUB_TOKEN"
    echo "   - GITHUB_WEBHOOK_SECRET"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ .env file found${NC}\n"

# Check for required environment variables
if ! grep -q "GEMINI_API_KEY=" server/.env || grep -q "GEMINI_API_KEY=your_gemini_api_key_here" server/.env; then
    echo -e "${RED}❌ GEMINI_API_KEY not configured${NC}"
    exit 1
fi

if ! grep -q "GITHUB_TOKEN=" server/.env || grep -q "GITHUB_TOKEN=your_github_personal_access_token" server/.env; then
    echo -e "${RED}❌ GITHUB_TOKEN not configured${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Environment variables configured${NC}\n"

# Install dependencies
echo -e "${YELLOW}📦 Installing server dependencies...${NC}"
cd server
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencies installed${NC}\n"

# Build TypeScript
echo -e "${YELLOW}🔨 Building TypeScript...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful${NC}\n"

echo -e "${GREEN}🎉 Setup complete!${NC}\n"
echo -e "${YELLOW}To start the server, run:${NC}"
echo "cd server && npm start"
echo ""
echo -e "${YELLOW}For webhook testing with ngrok:${NC}"
echo "ngrok http 3000"
echo "Then use: https://<ngrok-id>.ngrok.io/webhook/github as webhook URL"
