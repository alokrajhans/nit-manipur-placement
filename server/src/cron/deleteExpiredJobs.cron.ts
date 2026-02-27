import cron from 'node-cron';
import {injectable, lifeCycleObserver} from '@loopback/core';
import {repository} from '@loopback/repository';
import {OngoingJobsRepository} from '../repositories';

@injectable()
@lifeCycleObserver('cron-job')
export class DeleteExpiredJobsCron {
  constructor(
    @repository(OngoingJobsRepository)
    public ongoingJobsRepository: OngoingJobsRepository,
  ) {
    // ⏰ Run every day at midnight
    cron.schedule('0 0 * * *', async () => {
      try {
        const result = await this.ongoingJobsRepository.execute(
          `DELETE FROM ongoing_jobs WHERE deadline IS NOT NULL AND deadline < NOW() - INTERVAL 2 DAY;`
        );
        console.log('Expired jobs deleted:', result);
        console.log(`[CRON] Deleted expired jobs at ${new Date().toISOString()}`);

      } catch (error) {
        console.error('Cron job failed:', error);
      }
    });
  }
}
