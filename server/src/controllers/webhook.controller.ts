import {
  post,
  requestBody,
  response,
} from '@loopback/rest';
import { inject } from '@loopback/core';
import { GeminiService } from '../services/gemini.service';
import crypto from 'crypto';

interface GitHubPREvent {
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
  };
  repository: {
    name: string;
    full_name: string;
  };
}

interface FileChange {
  filename: string;
  patch: string;
}

export class WebhookController {
  constructor(
    @inject('services.GeminiService')
    protected geminiService: GeminiService,
  ) {}

  @post('/webhook/github')
  @response(200, {
    description: 'Webhook received and processed',
  })
  async handleGitHubWebhook(
    @requestBody({
      content: {
        'application/json': {},
      },
    })
    body: any,
  ): Promise<{ message: string; analysis?: any }> {
    // Verify webhook signature
    const signature = this.getSignatureHeader();
    if (!this.verifyWebhookSignature(body, signature)) {
      return { message: 'Invalid webhook signature' };
    }

    const event: GitHubPREvent = body;

    // Only process PR opened and synchronize events
    if (!['opened', 'synchronize', 'reopened'].includes(event.action)) {
      return { message: `Action ${event.action} not processed` };
    }

    try {
      // Extract PR details
      const prDetails = {
        title: event.pull_request.title,
        description: event.pull_request.body || 'No description provided',
        files: await this.fetchChangedFiles(
          event.repository.full_name,
          event.pull_request.number,
        ),
        additions: event.pull_request.additions,
        deletions: event.pull_request.deletions,
      };

      // Analyze PR using Gemini
      const analysis = await this.geminiService.analyzePR(prDetails);

      // Post comment on PR with analysis
      await this.postPRComment(
        event.repository.full_name,
        event.pull_request.number,
        analysis,
      );

      console.log(
        `✅ Webhook processed for PR #${event.pull_request.number} in ${event.repository.full_name}`,
      );

      return {
        message: 'Webhook processed successfully',
        analysis,
      };
    } catch (error) {
      console.error('Error processing webhook:', error);
      return {
        message: `Error processing webhook: ${error}`,
      };
    }
  }

  private getSignatureHeader(): string {
    // Get from request headers - implementation depends on your framework
    return process.env.GITHUB_WEBHOOK_SECRET || '';
  }

  private verifyWebhookSignature(body: any, signature: string): boolean {
    const secret = process.env.GITHUB_WEBHOOK_SECRET;
    if (!secret) {
      console.warn('GITHUB_WEBHOOK_SECRET not set, skipping verification');
      return true;
    }

    const payload = JSON.stringify(body);
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const expectedSignature = 'sha256=' + hmac.digest('hex');

    return signature === expectedSignature;
  }

  private async fetchChangedFiles(
    repoFullName: string,
    prNumber: number,
  ): Promise<FileChange[]> {
    try {
      const token = process.env.GITHUB_TOKEN;
      const response = await fetch(
        `https://api.github.com/repos/${repoFullName}/pulls/${prNumber}/files`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      const files = (await response.json()) as Array<{filename: string; patch?: string}>;
      return files.map((file: any) => ({
        filename: file.filename,
        patch: file.patch || '',
      }));
    } catch (error) {
      console.error('Error fetching changed files:', error);
      return [];
    }
  }

  private async postPRComment(
    repoFullName: string,
    prNumber: number,
    analysis: any,
  ): Promise<void> {
    try {
      const token = process.env.GITHUB_TOKEN;
      const comment = this.formatAnalysisComment(analysis);

      const response = await fetch(
        `https://api.github.com/repos/${repoFullName}/issues/${prNumber}/comments`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
          },
          body: JSON.stringify({ body: comment }),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to post comment: ${response.statusText}`);
      }

      console.log(`✅ Comment posted on PR #${prNumber}`);
    } catch (error) {
      console.error('Error posting PR comment:', error);
      // Don't throw - we don't want webhook to fail if comment posting fails
    }
  }

  private formatAnalysisComment(analysis: any): string {
    let comment = `## 🤖 AI Code Review by Gemini\n\n`;

    if (analysis.summary) {
      comment += `### Summary\n${analysis.summary}\n\n`;
    }

    if (analysis.suggestions && analysis.suggestions.length > 0) {
      comment += `### 💡 Suggestions\n`;
      analysis.suggestions.forEach((suggestion: string, i: number) => {
        comment += `${i + 1}. ${suggestion}\n`;
      });
      comment += '\n';
    }

    if (analysis.testSuggestions && analysis.testSuggestions.length > 0) {
      comment += `### 🧪 Testing Suggestions\n`;
      analysis.testSuggestions.forEach((suggestion: string, i: number) => {
        comment += `${i + 1}. ${suggestion}\n`;
      });
      comment += '\n';
    }

    if (
      analysis.securityConcerns &&
      analysis.securityConcerns.length > 0
    ) {
      comment += `### 🔒 Security Concerns\n`;
      analysis.securityConcerns.forEach((concern: string, i: number) => {
        comment += `${i + 1}. ${concern}\n`;
      });
      comment += '\n';
    }

    comment += `---\n*This review was automatically generated by Gemini AI*`;

    return comment;
  }
}
