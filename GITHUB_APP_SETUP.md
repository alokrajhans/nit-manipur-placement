# GitHub App PR Automation Setup Guide

Complete guide to set up GitHub App-based PR automation using Gemini AI for the NIT Manipur Placement project.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Why GitHub Apps?](#why-github-apps)
3. [Step-by-Step Setup](#step-by-step-setup)
4. [Configuration](#configuration)
5. [Testing](#testing)
6. [Monitoring](#monitoring)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 18+ and npm
- Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikeys)
- GitHub account with repository access
- Server accessible from the internet (or ngrok for local testing)
- SSL/HTTPS certificate (required for webhooks)

## Why GitHub Apps?

GitHub Apps provide several advantages over Personal Access Tokens:

### ✅ Benefits

| Feature | Personal Token | GitHub App |
|---------|---|---|
| **Security** | Tied to user account | Separate authentication |
| **Permissions** | All-or-nothing | Granular per-repository |
| **Rate Limits** | 5,000 requests/hour | 15,000 requests/hour per installation |
| **Installation** | Manual per repo | One-click installation |
| **Scoping** | User-wide | Per-repository |
| **Audit Trail** | User-level | App-level with distinct bot user |
| **Revocation** | Must regenerate token | Uninstall app from repo |

### Key Advantages

1. **Better Security** - Credentials scoped to specific repositories
2. **Higher Rate Limits** - More API calls allowed
3. **Cleaner Audit Trail** - Actions attributed to bot, not user
4. **Easier Management** - Install/uninstall per repository
5. **Professional** - Looks like an official bot

## Step-by-Step Setup

### Step 1: Create GitHub App

1. Go to GitHub Developer Settings: `https://github.com/settings/apps`
2. Click "New GitHub App"
3. Fill in the form:

```
GitHub App name: NIT Placement PR Review Bot
Homepage URL: https://github.com/alokrajhans/nit-manipur-placement
Webhook URL: https://your-domain.com/github-app/webhook
Webhook Secret: (generate a strong secret - copy this)
```

4. Set **Permissions**:

```
Repository permissions:
  - Contents: Read
  - Pull requests: Write
  - Statuses: Write
  - Checks: Write
```

5. Set **Events to subscribe to**:

```
✅ Pull request
✅ Pull request review
✅ Pull request review comment
```

6. Under "Where can this GitHub App be installed?":
   - Select: "Only on this account"
   
7. Click "Create GitHub App"

### Step 2: Generate Private Key

1. In your GitHub App settings, scroll to "Private keys"
2. Click "Generate a private key"
3. A `.pem` file will download - **KEEP THIS SAFE**
4. Copy the contents of the file (you'll need it for environment variables)

### Step 3: Get App ID and Installation ID

1. Note your **App ID** from the app settings page
2. Go to "Install App" tab
3. Click "Install" next to your repository
4. After installation, the URL will contain the installation ID:
   ```
   https://github.com/settings/installations/12345678
                                              ^^^^^^^^
                                         Installation ID
   ```

### Step 4: Configure Environment Variables

1. Copy the environment template:
```bash
cp server/.env.example server/.env
```

2. Update `.env` with GitHub App credentials:
```env
# Gemini Configuration
GEMINI_API_KEY=<from-google-ai-studio>

# GitHub App Configuration (Recommended)
GITHUB_APP_ID=12345678
GITHUB_APP_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----

# Webhook Secret (must match webhook settings)
GITHUB_WEBHOOK_SECRET=your_secure_webhook_secret_minimum_32_chars

# Other configurations...
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=placement_db
JWT_SECRET=your_jwt_secret_key
```

### Step 5: Install Dependencies

```bash
cd server
npm install
npm run build
```

### Step 6: Start the Server

```bash
npm start
```

Or for development with watch:
```bash
npm run build:watch &
npm start
```

## Configuration

### GitHub App Manifest

The app manifest is configured in `server/config/github-app-manifest.json`:

```json
{
  "name": "NIT Placement PR Review Bot",
  "permissions": {
    "pull_requests": "write",
    "contents": "read",
    "metadata": "read",
    "checks": "write",
    "statuses": "write"
  },
  "events": [
    "pull_request",
    "pull_request_review",
    "pull_request_review_comment"
  ]
}
```

### Rate Limiting

The controller implements automatic rate limiting:
- 1 second delay between GitHub API calls
- Prevents 403 rate limit errors
- Automatically retried with exponential backoff

### Caching

The Gemini service implements intelligent caching:
- Caches analysis results for 1 hour
- Reduces API calls for similar PRs
- Cache statistics available via service

## Testing

### Local Testing with ngrok

1. **Install ngrok**: https://ngrok.com/download

2. **Start ngrok**:
```bash
ngrok http 3000
```

3. **Update webhook URL** in GitHub App settings:
   - Go to https://github.com/settings/apps/your-app
   - Change Webhook URL to: `https://<ngrok-id>.ngrok.io/github-app/webhook`

4. **Create a test PR**:
   - Create a feature branch
   - Make some code changes
   - Push and create a PR
   - Watch the bot analyze and comment!

### Production Deployment

1. **Ensure HTTPS** - GitHub requires HTTPS for webhooks
2. **Update webhook URL** in GitHub App settings to production domain
3. **Keep credentials secure** - Use environment variables, never commit secrets
4. **Monitor logs** - Check server logs for webhook processing

## Monitoring

### View Webhook Deliveries

1. Go to GitHub App settings: https://github.com/settings/apps/your-app
2. Click "Advanced" tab
3. Scroll to "Recent deliveries"
4. Click on a delivery to see request/response

### Server Logs

The bot logs detailed information:

```
📨 Processing opened event for PR #123 in owner/repo
✅ Using cached analysis result
📦 Job enqueued: job_1234567890_abc123 (type: pr_analysis)
✅ Successfully analyzed and reviewed PR #123
```

### Queue Status

Check webhook queue status via API (add to your admin dashboard):

```typescript
const queueService = app.getSync('services.WebhookQueueService');
const stats = queueService.getQueueStats();
console.log(stats);
// Output:
// {
//   total: 5,
//   pending: 0,
//   processing: 0,
//   completed: 5,
//   failed: 0
// }
```

## Advanced Features

### Custom Filtering

The controller automatically filters files:
- Ignores `node_modules/`, `dist/`, `build/`
- Skips lock files and source maps
- Focuses on actual source code

### Draft PR Handling

- Draft PRs are skipped until marked "ready for review"
- Reduces unnecessary API calls
- Respects developer workflow

### Duplicate Review Prevention

- Checks for existing bot comments
- Won't re-review if already analyzed
- Reduces duplicate notifications

## Environment Variables Reference

```env
# GitHub App (Recommended approach)
GITHUB_APP_ID=Your app ID number
GITHUB_APP_PRIVATE_KEY=Your private key (multiline)
GITHUB_WEBHOOK_SECRET=Your webhook secret

# Alternative: Personal Access Token (Legacy)
GITHUB_TOKEN=Your PAT token

# Gemini AI
GEMINI_API_KEY=Your Gemini API key

# Server
NODE_ENV=production|development
PORT=3000

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=placement_db
DB_PORT=3306

# JWT
JWT_SECRET=Your JWT signing secret

# Bot Settings
BOT_NAME=nit-placement-bot
BOT_DESCRIPTION=AI-powered PR review bot
```

## Security Best Practices

1. **Never commit secrets**
   - Use `.env` file (not committed to git)
   - Use `server/.env.example` as template

2. **Rotate credentials regularly**
   - Generate new private key periodically
   - Regenerate webhook secrets

3. **Webhook signature verification**
   - Always verify `X-Hub-Signature-256` header
   - Prevents unauthorized requests

4. **Rate limiting**
   - Implement rate limits on your API endpoints
   - Monitor GitHub API usage

5. **Error handling**
   - Never expose sensitive data in error messages
   - Log errors securely

## Troubleshooting

### Webhook not receiving events

**Check list:**
- Verify webhook URL is correct and accessible
- Check HTTPS certificate is valid
- Verify webhook secret matches GitHub settings
- Check server logs for errors

**Solution:**
```bash
# Check if webhook URL is reachable
curl -v https://your-domain.com/github-app/webhook

# View recent webhook deliveries in GitHub
# https://github.com/settings/apps/your-app -> Advanced -> Recent Deliveries
```

### Webhook signature verification fails

**Cause:** Secret mismatch between GitHub and server

**Solution:**
1. Get secret from GitHub App settings
2. Ensure it exactly matches `GITHUB_WEBHOOK_SECRET` in `.env`
3. Restart server: `npm start`

### Gemini API errors

**Check:**
- `GEMINI_API_KEY` is correct
- API is enabled at https://aistudio.google.com/app/apikeys
- Rate limits not exceeded
- Network connectivity

**Debugging:**
```bash
# Test Gemini API connection
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=$GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

### GitHub API rate limiting

**Symptoms:** 403 errors or "API rate limit exceeded"

**Solution:**
- Use GitHub App instead of Personal Token (higher limit)
- Implement caching (already included)
- Reduce file change processing

### Bot not commenting on PRs

**Check:**
1. Webhook is being received (check Recent Deliveries)
2. App has "Pull requests: write" permission
3. Check server logs for errors
4. Verify installation ID in URL

**Debug:**
```bash
# Test GitHub API directly
TOKEN="your_installation_token"
REPO="owner/repo"
PR=123

curl -X POST "https://api.github.com/repos/$REPO/issues/$PR/comments" \
  -H "Authorization: token $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"body":"Test comment"}'
```

### High memory usage

**Cause:** Cache growing too large

**Solution:**
```typescript
// Clear old cached jobs
const queueService = app.getSync('services.WebhookQueueService');
queueService.clearOldJobs(3600000); // Clear jobs older than 1 hour

// Clear Gemini analysis cache
const geminiService = app.getSync('services.GeminiService');
geminiService.clearCache();
```

## Next Steps

1. ✅ Create GitHub App
2. ✅ Configure environment variables
3. ✅ Install dependencies and build
4. ✅ Test with ngrok locally
5. ✅ Deploy to production
6. ✅ Monitor webhook deliveries
7. ✅ Customize review comments if needed

## Support & Resources

- [GitHub Apps Documentation](https://docs.github.com/en/developers/apps)
- [GitHub Webhooks Guide](https://docs.github.com/en/developers/webhooks-and-events/webhooks)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [LoopBack Framework](https://loopback.io/)

## Files Overview

```
server/
├── src/
│   ├── services/
│   │   ├── gemini.service.ts           # AI analysis with caching & retries
│   │   ├── github-app-auth.service.ts  # JWT & token management
│   │   └── webhook-queue.service.ts    # Job queue for async processing
│   ├── controllers/
│   │   ├── webhook.controller.ts       # Legacy webhook endpoint
│   │   └── github-app.controller.ts    # GitHub App webhook handler
│   └── application.ts                   # App configuration & bindings
├── config/
│   └── github-app-manifest.json        # App manifest configuration
├── .env.example                         # Environment template
└── package.json                         # Dependencies (updated)
```

---

For additional help, check the [Troubleshooting](#troubleshooting) section or open an issue on GitHub.
