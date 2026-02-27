import {
  post,
  requestBody,
  response,
  Request,
  RestBindings,
} from '@loopback/rest';
import { inject } from '@loopback/core';
import { GeminiService } from '../services/gemini.service';
import { GitHubAppAuthService } from '../services/github-app-auth.service';

interface GitHubAppWebhookPayload {
  action: string;
  pull_request: {
    number: number;
    title: string;
    body: string;
    additions: number;
    deletions: number;
    changed_files: number;
    head: {
      ref: string;
      sha: string;
    };
    base: {
      ref: string;
    };
    user: {
      login: string;
    };
    html_url: string;
    state: string;
    draft: boolean;
  };
  repository: {
    name: string;
    full_name: string;
    private: boolean;
  };
  installation: {
    id: number;
  };
  sender: {
    login: string;
    type: string;
  };
}

interface FileChange {
  filename: string;
  patch: string;
  status: string;
  additions: number;
  deletions: number;
}

export class GitHubAppController {
  private readonly RATE_LIMIT_DELAY = 1000; // 1 second between API calls
  private lastApiCall = 0;

  constructor(
    @inject('services.GeminiService')
    protected geminiService: GeminiService,
    @inject('services.GitHubAppAuthService')
    protected githubAppAuthService: GitHubAppAuthService,
    @inject(RestBindings.Http.REQUEST)
    protected request: Request,
  ) {}

  @post('/github-app/webhook')
  @response(200, {
    description: 'GitHub App webhook processed successfully',
  })
  async handleGitHubAppWebhook(
    @requestBody({
      content: {
        'application/json': {},
      },
    })
    body: any,
  ): Promise<{ success: boolean; message: string; prNumber?: number }> {
    const signature = this.request.headers['x-hub-signature-256'] as string;
    const payload = JSON.stringify(body);

    // Verify webhook signature
    if (!this.githubAppAuthService.verifyWebhookSignature(payload, signature)) {
      console.warn('❌ Invalid webhook signature');
      return { success: false, message: 'Invalid webhook signature' };
    }

    const event: GitHubAppWebhookPayload = body;

    // Only process specific PR actions
    const allowedActions = ['opened', 'synchronize', 'reopened', 'ready_for_review'];
    if (!allowedActions.includes(event.action)) {
      return { success: false, message: `Action ${event.action} not processed` };
    }

    // Skip draft PRs unless action is ready_for_review
    if (event.pull_request.draft && event.action !== 'ready_for_review') {
      console.log(
        `⏭️  Skipping draft PR #${event.pull_request.number} - waiting for ready_for_review`,
      );
      return {
        success: false,
        message: 'Draft PR skipped - waiting for ready_for_review',
      };
    }

    try {
      console.log(
        `📨 Processing ${event.action} event for PR #${event.pull_request.number} in ${event.repository.full_name}`,
      );

      // Get installation token
      const token = await this.githubAppAuthService.getInstallationToken(
        event.installation.id,
      );

      // Check if already reviewed
      const existingReview = await this.findExistingReview(
        event,
        token,
      );
      if (existingReview) {
        console.log(
          `✅ Existing review found for PR #${event.pull_request.number}, skipping...`,
        );
        return {
          success: false,
          message: 'PR already reviewed by bot',
          prNumber: event.pull_request.number,
        };
      }

      // Fetch changed files
      const files = await this.fetchChangedFiles(event, token);
      if (files.length === 0) {
        console.warn('⚠️  No files to analyze');
        return {
          success: false,
          message: 'No files to analyze',
          prNumber: event.pull_request.number,
        };
      }

      // Analyze PR with Gemini
      const analysis = await this.geminiService.analyzePR({
        title: event.pull_request.title,
        description: event.pull_request.body || 'No description provided',
        files,
        additions: event.pull_request.additions,
        deletions: event.pull_request.deletions,
      });

      // Post review to PR
      await this.postPullRequestReview(
        event,
        token,
        analysis,
      );

      console.log(
        `✅ Successfully analyzed and reviewed PR #${event.pull_request.number}`,
      );

      return {
        success: true,
        message: 'PR analyzed and reviewed successfully',
        prNumber: event.pull_request.number,
      };
    } catch (error) {
      console.error('❌ Error processing GitHub App webhook:', error);
      return {
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  private async findExistingReview(
    event: GitHubAppWebhookPayload,
    token: string,
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${event.repository.full_name}/pulls/${event.pull_request.number}/comments`,
        {
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'NIT-Placement-PR-Bot',
          },
        },
      );

      if (!response.ok) return false;

      const comments = (await response.json()) as Array<{
        user: { login: string };
        body: string;
      }>;

      return comments.some(
        c =>
          c.user.login === 'nit-placement-bot' &&
          c.body.includes('🤖 AI Code Review'),
      );
    } catch (error) {
      console.warn('Error checking existing reviews:', error);
      return false;
    }
  }

  private async fetchChangedFiles(
    event: GitHubAppWebhookPayload,
    token: string,
  ): Promise<FileChange[]> {
    try {
      await this.applyRateLimit();

      const response = await fetch(
        `https://api.github.com/repos/${event.repository.full_name}/pulls/${event.pull_request.number}/files`,
        {
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'NIT-Placement-PR-Bot',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      const files = (await response.json()) as Array<{
        filename: string;
        patch?: string;
        status: string;
        additions: number;
        deletions: number;
      }>;

      // Filter to relevant files (exclude node_modules, dist, etc.)
      const relevantFiles = files.filter(f => this.isRelevantFile(f.filename));

      return relevantFiles.map(f => ({
        filename: f.filename,
        patch: f.patch || '',
        status: f.status,
        additions: f.additions,
        deletions: f.deletions,
      }));
    } catch (error) {
      console.error('Error fetching changed files:', error);
      return [];
    }
  }

  private isRelevantFile(filename: string): boolean {
    const irrelevantPatterns = [
      /node_modules\//,
      /dist\//,
      /build\//,
      /\.lock$/,
      /\.map$/,
      /package-lock\.json$/,
      /yarn\.lock$/,
      /\.git\//,
      /\.env/,
      /\.md$/,
    ];

    return !irrelevantPatterns.some(pattern => pattern.test(filename));
  }

  private async postPullRequestReview(
    event: GitHubAppWebhookPayload,
    token: string,
    analysis: any,
  ): Promise<void> {
    try {
      const comment = this.formatReviewComment(analysis, event);

      await this.applyRateLimit();

      const response = await fetch(
        `https://api.github.com/repos/${event.repository.full_name}/issues/${event.pull_request.number}/comments`,
        {
          method: 'POST',
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'NIT-Placement-PR-Bot',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ body: comment }),
        },
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(
          `Failed to post comment: ${response.status} ${error}`,
        );
      }

      console.log(`✅ Review comment posted on PR #${event.pull_request.number}`);
    } catch (error) {
      console.error('Error posting PR review:', error);
      throw error;
    }
  }

  private formatReviewComment(analysis: any, event: GitHubAppWebhookPayload): string {
    let comment = `## 🤖 AI Code Review by Gemini\n\n`;

    if (analysis.summary) {
      comment += `### 📋 Summary\n${analysis.summary}\n\n`;
    }

    if (analysis.suggestions && analysis.suggestions.length > 0) {
      comment += `### 💡 Suggestions\n`;
      analysis.suggestions.forEach((suggestion: string, i: number) => {
        comment += `${i + 1}. ${suggestion}\n`;
      });
      comment += '\n';
    }

    if (analysis.testSuggestions && analysis.testSuggestions.length > 0) {
      comment += `### 🧪 Testing Recommendations\n`;
      analysis.testSuggestions.forEach((suggestion: string, i: number) => {
        comment += `${i + 1}. ${suggestion}\n`;
      });
      comment += '\n';
    }

    if (analysis.securityConcerns && analysis.securityConcerns.length > 0) {
      comment += `### 🔒 Security Considerations\n`;
      analysis.securityConcerns.forEach((concern: string, i: number) => {
        comment += `${i + 1}. ${concern}\n`;
      });
      comment += '\n';
    }

    // Add quality metrics if available
    if (analysis.performance !== undefined || analysis.scalability !== undefined) {
      comment += `### ⚡ Quality Metrics\n`;
      comment += `- Performance Optimized: ${analysis.performance ? '✅ Yes' : '⚠️ Could be improved'}\n`;
      comment += `- Scalable Design: ${analysis.scalability ? '✅ Yes' : '⚠️ Could be improved'}\n`;
      if (analysis.maintainability) {
        comment += `- Maintainability: ${analysis.maintainability}\n`;
      }
      comment += '\n';
    }

    comment += `---\n`;
    comment += `*This review was automatically generated by Gemini AI on ${new Date().toLocaleString()}*\n`;
    comment += `_Feel free to discuss the feedback in the comments below._`;

    return comment;
  }

  private async applyRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastApiCall;
    if (timeSinceLastCall < this.RATE_LIMIT_DELAY) {
      await new Promise(resolve =>
        setTimeout(resolve, this.RATE_LIMIT_DELAY - timeSinceLastCall),
      );
    }
    this.lastApiCall = Date.now();
  }
}
