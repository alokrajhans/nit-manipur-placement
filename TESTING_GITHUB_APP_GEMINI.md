# Testing GitHub App + Gemini PR Reviewer

## Complete Testing Guide

---

## 1. Prerequisites

Before testing, ensure you have:

- ✅ GitHub App created and installed on a test repository
- ✅ `GITHUB_APP_ID` and `GITHUB_APP_PRIVATE_KEY` configured
- ✅ `GITHUB_WEBHOOK_SECRET` configured
- ✅ `GOOGLE_API_KEY` (Gemini API key) configured
- ✅ Webhook URL pointing to your server: `https://your-server.com/github-app/webhook`
- ✅ Application running locally or on Render

---

## 2. Local Testing Setup

### Step 1: Start Your Application Locally

```bash
cd server
npm start
```

Expected output:
```
📊 Using SQLite database (default - no external DB needed)
Database schema updated
Server is running at http://127.0.0.1:3000
Try http://127.0.0.1:3000/ping
```

### Step 2: Expose Local Server to Internet (for GitHub Webhooks)

Use **ngrok** to expose your local server:

```bash
# Install ngrok (if not already installed)
npm install -g ngrok

# Start ngrok on port 3000
ngrok http 3000
```

Output will show:
```
Forwarding     https://abc123def456.ngrok.io -> http://127.0.0.1:3000
```

### Step 3: Update GitHub App Webhook URL

1. Go to GitHub Settings → Developer settings → GitHub Apps
2. Click on your app
3. Update "Webhook URL" to: `https://abc123def456.ngrok.io/github-app/webhook`
4. Keep the webhook secret the same

---

## 3. Test Cases

### Test Case 1: Create a New PR on Test Repository

**Step 1:** Create a test branch and make changes
```bash
git checkout -b test/pr-review-feature
# Make some code changes
echo "console.log('test');" >> test.js
git add .
git commit -m "Add test feature"
git push origin test/pr-review-feature
```

**Step 2:** Create a Pull Request on GitHub
- Go to your test repository
- Click "New Pull Request"
- Select `test/pr-review-feature` branch
- Create PR with title and description
- **Don't mark as draft** (drafts are skipped until ready for review)

**Expected Flow:**
1. GitHub sends webhook to your server
2. Server validates signature
3. Server fetches changed files from GitHub
4. Gemini analyzes the code
5. Bot posts review comment on PR

**Check Your Server Logs:**
```
📨 Processing opened event for PR #1 in your-user/repo-name
🔍 Analyzing PR with Gemini...
✅ Successfully analyzed and reviewed PR #1
```

---

### Test Case 2: Push to Existing PR (Synchronize Event)

**Step 1:** Make additional commits to your branch
```bash
echo "console.log('another test');" >> test.js
git add .
git commit -m "Add more features"
git push origin test/pr-review-feature
```

**Expected:**
- Webhook fires with `synchronize` action
- Bot posts a new analysis

**Server Logs:**
```
📨 Processing synchronize event for PR #1
🤖 Updating review with new analysis...
✅ Successfully analyzed and reviewed PR #1
```

---

### Test Case 3: Draft PR to Ready for Review

**Step 1:** Create PR as draft
- Create new PR with "Still in progress" checkbox marked

**Step 2:** Server will skip it
```
⏭️  Skipping draft PR #2 - waiting for ready_for_review
```

**Step 3:** Mark as ready for review
- In GitHub PR, click "Ready for review" button

**Expected:**
- Webhook fires with `ready_for_review` action
- Bot analyzes and posts review

---

### Test Case 4: Already Reviewed PR

**Expected Behavior:**
- When synchronizing an already-reviewed PR
- Bot checks for existing reviews
- If found: Bot skips (doesn't duplicate reviews)

**Server Logs:**
```
✅ Existing review found for PR #1, skipping...
```

---

## 4. Manual Webhook Testing (Using cURL)

### Test Webhook Signature Verification

Generate a valid webhook payload:

```bash
# Create test payload
cat > test-payload.json << 'EOF'
{
  "action": "opened",
  "pull_request": {
    "number": 1,
    "title": "Test PR",
    "body": "Test description",
    "additions": 10,
    "deletions": 5,
    "changed_files": 2,
    "draft": false,
    "head": {
      "ref": "test-branch",
      "sha": "abc123def456"
    },
    "base": {
      "ref": "main"
    },
    "user": {
      "login": "testuser"
    },
    "html_url": "https://github.com/test/repo/pull/1",
    "state": "open"
  },
  "repository": {
    "name": "repo",
    "full_name": "test/repo",
    "private": false
  },
  "installation": {
    "id": 12345
  },
  "sender": {
    "login": "testuser",
    "type": "User"
  }
}
EOF

# Generate webhook signature
PAYLOAD=$(cat test-payload.json)
SECRET="your_webhook_secret"
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" -hex | sed 's/.*= /sha256=/')

# Send webhook
curl -X POST http://localhost:3000/github-app/webhook \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: $SIGNATURE" \
  -d "$PAYLOAD"
```

---

## 5. Debugging & Monitoring

### Check Application Health

```bash
# Check health status
curl http://localhost:3000/health

# Detailed metrics
curl http://localhost:3000/health/detailed
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-02-27T10:00:00Z",
  "components": {
    "gemini": { "status": "ok", "cached": 1, "failed": 0 },
    "github": { "status": "ok", "requests": 5 },
    "queue": { "pending": 0, "completed": 2 }
  }
}
```

### View Bot Comments on PR

1. Go to your PR on GitHub
2. Look for comments from your bot account
3. Should see: "🤖 AI Code Review" header
4. Review suggestions below

### Check Cache Status

```bash
# Clear AI analysis cache
curl -X GET http://localhost:3000/health/clear-cache

# Cache will be refreshed on next PR
```

---

## 6. What the Bot Analyzes

The Gemini PR reviewer analyzes:

✅ **Code Quality**
- Syntax errors
- Best practices
- Performance issues
- Security vulnerabilities

✅ **Structure**
- Code organization
- Function complexity
- Documentation quality

✅ **Specific to File Types**
- TypeScript: Type safety, interfaces
- JavaScript: ES6+ usage, async/await
- React: Component structure, hooks
- CSS: Performance, specificity

---

## 7. Example Bot Review Comment

```
🤖 AI Code Review

## Summary
✅ Good: Clean implementation with TypeScript types
⚠️ Warning: Function exceeds 30 lines - consider splitting

## Suggestions

### 1. Consider splitting large function
**File:** src/utils/helper.ts (Line 45-85)
The `processData` function is 40 lines. Consider:
- Extract helper functions
- Break into smaller units
- Improves readability and testability

### 2. Add error handling
**File:** src/services/api.ts (Line 20)
Missing try-catch for async operation:
```typescript
// Consider wrapping in try-catch
const response = await fetchData();
```

## Overall Assessment
✅ Good code quality
✅ Proper TypeScript usage
📝 Consider: Add unit tests for edge cases

Generated at: 2026-02-27 10:00:00 UTC
Analysis time: 2.3s
```

---

## 8. Troubleshooting

### Issue: Bot doesn't comment on PR

**Check:**
1. Is webhook reaching your server?
   ```bash
   # Check server logs
   # Should see: "📨 Processing opened event"
   ```

2. Is signature valid?
   ```bash
   # Server logs should show signature verification
   # Look for: "Invalid webhook signature" error
   ```

3. Are API credentials correct?
   ```bash
   # Check environment variables
   echo $GITHUB_APP_ID
   echo $GOOGLE_API_KEY
   ```

### Issue: "Gemini API error"

**Check:**
1. `GOOGLE_API_KEY` is valid
2. Gemini API is enabled in Google Cloud
3. API quota not exceeded

**In server logs:**
```
Gemini API Error: Invalid API key
```

### Issue: GitHub API rate limit errors

**Solution:**
- Application has 1-second rate limiting built-in
- Rate limit errors will trigger retry logic (3 attempts)
- If persistent, wait 1 hour for GitHub rate limit reset

### Issue: Draft PR shows no analysis

**Expected behavior:**
- Draft PRs are intentionally skipped
- Analysis starts after "Ready for review" is clicked
- This prevents analyzing incomplete work

---

## 9. Testing on Render

### Deploy and Test

1. Push to main branch
```bash
git push origin main
```

2. Render automatically deploys
3. Check deployment logs in Render dashboard

4. Create test PR on your GitHub repository
5. Monitor Render logs in real-time

### View Production Logs

```bash
# In Render Dashboard:
# 1. Go to your service
# 2. Click "Logs"
# 3. Filter by "github-app" or "webhook"
# 4. Watch in real-time as webhooks arrive
```

---

## 10. Performance Metrics

### Expected Response Times

| Operation | Time |
|-----------|------|
| Webhook receipt | < 100ms |
| Signature verification | < 10ms |
| File fetching | 1-2s |
| Gemini analysis | 2-5s |
| Review posting | 1-2s |
| **Total** | **5-10s** |

### Caching Benefits

- First analysis of same code: 5-10s
- Cached analysis: < 100ms
- Cache TTL: 1 hour
- Cache key: MD5 hash of code

---

## 11. Next Steps

After testing, you can:

1. **Customize Analysis**
   - Edit `src/services/gemini.service.ts`
   - Modify prompt to focus on specific issues
   - Add file-type specific analysis

2. **Add More Actions**
   - Analyze comments
   - Check commit message format
   - Validate code coverage

3. **Integrate with Other Services**
   - Send metrics to analytics
   - Post to team Slack channel
   - Create GitHub issues for major findings

---

## Quick Reference: Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/github-app/webhook` | POST | Receive GitHub webhooks |
| `/health` | GET | Basic health check |
| `/health/detailed` | GET | Detailed metrics |
| `/health/clear-cache` | GET | Clear analysis cache |
| `/ping` | GET | Server is running |

---

## Support & Resources

- GitHub App Webhooks: https://docs.github.com/webhooks/
- Gemini API: https://ai.google.dev/
- LoopBack Framework: https://loopback.io/
- ngrok: https://ngrok.com/

---

**Status:** ✅ Ready for Testing  
**Last Updated:** 2026-02-27
