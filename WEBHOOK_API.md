# GitHub Webhook API Documentation

## Endpoint

```
POST /webhook/github
```

## Authentication

The webhook uses GitHub's HMAC SHA256 signature verification for authentication.

**Header:** `X-Hub-Signature-256`
**Format:** `sha256=<signature>`

The signature is generated using the webhook secret and the request payload.

## Request Body

The endpoint receives the complete GitHub webhook payload. Here's the relevant structure:

```typescript
{
  action: 'opened' | 'synchronize' | 'reopened',
  pull_request: {
    number: number,
    title: string,
    body: string,
    additions: number,
    deletions: number,
    changed_files: number,
    head: {
      ref: string,
      sha: string
    },
    base: {
      ref: string
    },
    user: {
      login: string
    },
    html_url: string
  },
  repository: {
    name: string,
    full_name: string
  }
}
```

## Response

### Success (200 OK)

```json
{
  "message": "Webhook processed successfully",
  "analysis": {
    "summary": "This PR adds webhook functionality...",
    "suggestions": [
      "Add error handling",
      "Add unit tests",
      "Consider performance implications"
    ],
    "testSuggestions": [
      "Test webhook signature validation",
      "Test with various PR sizes"
    ],
    "securityConcerns": [
      "Verify webhook secret validation",
      "Ensure API keys are not exposed"
    ]
  }
}
```

### Processing (No Action)

```json
{
  "message": "Action [action_name] not processed"
}
```

### Error (200 OK with message)

```json
{
  "message": "Error processing webhook: [error details]"
}
```

## Events Processed

The webhook processes the following GitHub PR events:

- **opened** - When a PR is created
- **synchronize** - When new commits are pushed to the PR
- **reopened** - When a closed PR is reopened

## What Happens

1. **Receives Event** - GitHub sends the webhook event
2. **Verifies Signature** - Validates HMAC signature using webhook secret
3. **Fetches Files** - Retrieves changed files and diffs using GitHub API
4. **Analyzes Code** - Sends changes to Gemini AI for analysis
5. **Posts Comment** - Adds AI-generated review comment to the PR

## Rate Limiting

- **GitHub API**: Default 5,000 requests/hour (with authentication)
- **Gemini API**: Depends on your tier

## Environment Variables Required

```env
GEMINI_API_KEY=<your-gemini-api-key>
GITHUB_TOKEN=<your-github-token>
GITHUB_WEBHOOK_SECRET=<your-webhook-secret>
```

## Example GitHub Webhook Configuration

| Setting | Value |
|---------|-------|
| Payload URL | `https://your-domain.com/webhook/github` |
| Content type | `application/json` |
| Secret | Use same value as `GITHUB_WEBHOOK_SECRET` |
| Which events | Pull requests |
| Active | ✅ Yes |

## Error Handling

The endpoint gracefully handles various error scenarios:

- **Invalid signature** - Returns without processing
- **GitHub API errors** - Logs error, continues with available data
- **Gemini API errors** - Logs error, webhook still succeeds
- **Comment posting fails** - Logs error, analysis still completes

## Debugging

Check webhook deliveries in GitHub:

1. Go to your repository
2. Settings > Webhooks
3. Click on the webhook
4. View "Recent Deliveries"
5. Click on a delivery to see request/response details

## Logs

Server logs webhook processing:

```
✅ Webhook processed for PR #123 in owner/repo
✅ Comment posted on PR #123
❌ Error processing webhook: <error message>
```

## Example cURL Request (for testing)

```bash
# Generate signature
SECRET="your-webhook-secret"
PAYLOAD='{"action":"opened","pull_request":{"number":1,...}}'
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" | sed 's/^.*= //')

# Send request
curl -X POST https://your-domain.com/webhook/github \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=$SIGNATURE" \
  -d "$PAYLOAD"
```

## Best Practices

1. **Security**
   - Store webhook secret securely
   - Never commit secrets to version control
   - Use GitHub's signature verification

2. **Performance**
   - Process webhooks asynchronously if possible
   - Implement request timeouts
   - Consider caching GitHub API responses

3. **Reliability**
   - Implement retry logic for failed API calls
   - Log all webhook events
   - Monitor webhook health

4. **Testing**
   - Use ngrok to test locally
   - Verify webhook signature generation
   - Test with real PR events

## Troubleshooting

### Webhook not being triggered
- Check webhook is enabled in GitHub settings
- Verify Events filter includes "Pull requests"
- Check repository has correct webhook URL

### Analysis comment not posting
- Verify `GITHUB_TOKEN` has correct scopes
- Check token hasn't expired
- Ensure bot account has permission to comment

### Signature verification fails
- Ensure `GITHUB_WEBHOOK_SECRET` matches GitHub configuration
- Check request body is not modified
- Verify signature header format: `sha256=<hex>`

## Future Enhancements

- [ ] Support for other event types (issues, commits, etc.)
- [ ] Custom analysis rules per repository
- [ ] AI-suggested fixes and code improvements
- [ ] Integration with CI/CD pipelines
- [ ] Webhook analytics and metrics
