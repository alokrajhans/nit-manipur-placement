import { injectable, BindingScope } from '@loopback/core';

export interface WebhookJob {
  id: string;
  type: string;
  payload: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  attempts: number;
  maxAttempts: number;
  error?: string;
  result?: any;
}

@injectable({ scope: BindingScope.SINGLETON })
export class WebhookQueueService {
  private queue: Map<string, WebhookJob> = new Map();
  private processing = false;
  private readonly DEFAULT_MAX_ATTEMPTS = 3;

  /**
   * Enqueue a webhook job
   */
  enqueueJob(
    type: string,
    payload: any,
    maxAttempts?: number,
  ): string {
    const id = this.generateJobId();
    const job: WebhookJob = {
      id,
      type,
      payload,
      status: 'pending',
      createdAt: new Date(),
      attempts: 0,
      maxAttempts: maxAttempts || this.DEFAULT_MAX_ATTEMPTS,
    };

    this.queue.set(id, job);
    console.log(`📦 Job enqueued: ${id} (type: ${type})`);

    return id;
  }

  /**
   * Get job by ID
   */
  getJob(jobId: string): WebhookJob | undefined {
    return this.queue.get(jobId);
  }

  /**
   * Update job status
   */
  updateJob(
    jobId: string,
    updates: Partial<WebhookJob>,
  ): WebhookJob | undefined {
    const job = this.queue.get(jobId);
    if (!job) return undefined;

    const updated = { ...job, ...updates };
    this.queue.set(jobId, updated);
    return updated;
  }

  /**
   * Get all pending jobs
   */
  getPendingJobs(): WebhookJob[] {
    return Array.from(this.queue.values()).filter(
      job => job.status === 'pending',
    );
  }

  /**
   * Get queue statistics
   */
  getQueueStats(): {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  } {
    const jobs = Array.from(this.queue.values());
    return {
      total: jobs.length,
      pending: jobs.filter(j => j.status === 'pending').length,
      processing: jobs.filter(j => j.status === 'processing').length,
      completed: jobs.filter(j => j.status === 'completed').length,
      failed: jobs.filter(j => j.status === 'failed').length,
    };
  }

  /**
   * Clear completed jobs older than specified time
   */
  clearOldJobs(ageMs: number = 3600000): number {
    // Default: 1 hour
    const now = Date.now();
    let cleared = 0;

    for (const [jobId, job] of this.queue.entries()) {
      if (
        job.status === 'completed' &&
        now - job.createdAt.getTime() > ageMs
      ) {
        this.queue.delete(jobId);
        cleared++;
      }
    }

    if (cleared > 0) {
      console.log(`🧹 Cleared ${cleared} old jobs`);
    }
    return cleared;
  }

  /**
   * Clear all jobs
   */
  clearAllJobs(): number {
    const size = this.queue.size;
    this.queue.clear();
    console.log(`🧹 Cleared all ${size} jobs`);
    return size;
  }

  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
