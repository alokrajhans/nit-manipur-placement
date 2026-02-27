import { get, response } from '@loopback/rest';
import { inject } from '@loopback/core';
import { GeminiService } from '../services/gemini.service';
import { GitHubAppAuthService } from '../services/github-app-auth.service';
import { WebhookQueueService } from '../services/webhook-queue.service';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  environment: {
    nodeEnv: string;
    hasGeminiKey: boolean;
    hasGitHubAppId: boolean;
  };
  services: {
    gemini: {
      cacheSize: number;
      cacheEntries: number;
    };
    githubApp: {
      cachedTokens: number;
    };
    webhookQueue: {
      total: number;
      pending: number;
      processing: number;
      completed: number;
      failed: number;
    };
  };
}

export class HealthController {
  private startTime = Date.now();

  constructor(
    @inject('services.GeminiService')
    protected geminiService: GeminiService,
    @inject('services.GitHubAppAuthService')
    protected githubAppAuthService: GitHubAppAuthService,
    @inject('services.WebhookQueueService')
    protected webhookQueueService: WebhookQueueService,
  ) {}

  @get('/health')
  @response(200, {
    description: 'Application health status',
  })
  getHealth(): HealthStatus {
    const queueStats = this.webhookQueueService.getQueueStats();
    const geminStats = this.geminiService.getCacheStats();
    const githubStats = this.githubAppAuthService.getCacheStats();

    const status = this.determineStatus(queueStats);

    return {
      status,
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      environment: {
        nodeEnv: process.env.NODE_ENV || 'development',
        hasGeminiKey: !!process.env.GEMINI_API_KEY,
        hasGitHubAppId: !!process.env.GITHUB_APP_ID,
      },
      services: {
        gemini: {
          cacheSize: geminStats.size,
          cacheEntries: geminStats.entries,
        },
        githubApp: {
          cachedTokens: githubStats.size,
        },
        webhookQueue: queueStats,
      },
    };
  }

  @get('/health/detailed')
  @response(200, {
    description: 'Detailed health and metrics',
  })
  getDetailedHealth(): any {
    const baseHealth = this.getHealth();
    const queueJobs = this.webhookQueueService.getPendingJobs();

    return {
      ...baseHealth,
      jobs: {
        pending: queueJobs.map(job => ({
          id: job.id,
          type: job.type,
          createdAt: job.createdAt,
          attempts: job.attempts,
        })),
      },
    };
  }

  @get('/health/clear-cache')
  @response(200, {
    description: 'Clear caches and return status',
  })
  clearCaches(): { message: string; cleared: object } {
    const geminiCacheBefore = this.geminiService.getCacheStats();
    this.geminiService.clearCache();

    const queueBefore = this.webhookQueueService.getQueueStats();
    const queueCleared = this.webhookQueueService.clearOldJobs();

    return {
      message: 'Caches cleared successfully',
      cleared: {
        geminiEntries: geminiCacheBefore.entries,
        queueOldJobs: queueCleared,
      },
    };
  }

  private determineStatus(
    queueStats: any,
  ): 'healthy' | 'degraded' | 'unhealthy' {
    // Consider unhealthy if there are too many failed jobs
    if (queueStats.failed > queueStats.completed) {
      return 'unhealthy';
    }

    // Consider degraded if there's a queue backlog
    if (queueStats.pending > 10) {
      return 'degraded';
    }

    // Check environment variables
    if (
      !process.env.GEMINI_API_KEY ||
      !process.env.GITHUB_WEBHOOK_SECRET
    ) {
      return 'unhealthy';
    }

    return 'healthy';
  }
}
