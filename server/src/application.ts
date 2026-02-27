import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import path from 'path';
import { MySequence } from './sequence';

// Repositories
import { CompaniesVisitedRepository } from './repositories/companies-visited.repository';
import { InterestedStudentsRepository } from './repositories/interested-students.repository';
import { OngoingJobsRepository } from './repositories/ongoing-jobs.repository';
import { SelectedStudentsRepository } from './repositories/selected-students.repository';
import { UserRepository } from './repositories/user.repository';
import { AppliedJobsRepository } from './repositories/applied-jobs.repository';

// Datasource
import { SqliteDataSource, MysqlDataSource } from './datasources';

// Auth
import { AuthenticationComponent, registerAuthenticationStrategy } from '@loopback/authentication';
import { JWTStrategy } from './strategies/jwt-strategies';
import { JWTService } from './service/jwt-service';
import { AuthController } from './controllers/auth.controller';
import { AppliedJobsController } from './controllers/applied-jobs.controllers';
import { DeleteExpiredJobsCron } from './cron/deleteExpiredJobs.cron';

// Services
import { GeminiService } from './services/gemini.service';
import { GitHubAppAuthService } from './services/github-app-auth.service';
import { WebhookQueueService } from './services/webhook-queue.service';

// Webhook & GitHub App
import { WebhookController } from './controllers/webhook.controller';
import { GitHubAppController } from './controllers/github-app.controller';
import { HealthController } from './controllers/health.controller';

// ✅ Cron
// import {DeleteExpiredJobsCron} from './cron/delete-expired-jobs.cron';

export { ApplicationConfig };

export class ServerApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Custom sequence
    this.sequence(MySequence);

    // Static home page
    this.static('/', path.join(__dirname, '../public'));

    // Explorer configuration
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;

    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
      // Disable auto-discovery of datasources to prevent MySQL from auto-connecting
      datasources: {
        dirs: [],  // Empty array prevents auto-discovery
        extensions: ['.datasource.js'],
        nested: true,
      },
    };

    // Bind datasources (SQLite by default, MySQL optional)
    const dbType = process.env.DB_TYPE || 'sqlite';
    
    if (dbType === 'mysql') {
      // Use MySQL if explicitly set
      this.bind('datasources.MysqlDataSource').toClass(MysqlDataSource);
      this.dataSource(MysqlDataSource);
      console.log('📊 Using MySQL database');
    } else {
      // Use SQLite by default (lightweight, no external dependency)
      this.bind('datasources.SqliteDataSource').toClass(SqliteDataSource);
      this.dataSource(SqliteDataSource);
      console.log('📊 Using SQLite database');
    }

    // Bind repositories
    this.repository(CompaniesVisitedRepository);
    this.repository(AppliedJobsRepository);
    this.repository(InterestedStudentsRepository);
    this.repository(OngoingJobsRepository);
    this.repository(SelectedStudentsRepository);
    this.repository(UserRepository);

    // Auth services
    this.bind('services.jwt.service').toClass(JWTService);
    this.bind('services.GeminiService').toClass(GeminiService);
    this.bind('services.GitHubAppAuthService').toClass(GitHubAppAuthService);
    this.bind('services.WebhookQueueService').toClass(WebhookQueueService);
    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, JWTStrategy);

    // Register controllers
    this.controller(AuthController);
    this.controller(AppliedJobsController);
    this.controller(WebhookController);
    this.controller(GitHubAppController);
    this.controller(HealthController);

    // ✅ Register cron job
    // Register cron job
    this.bind('cron.DeleteExpiredJobsCron').toClass(DeleteExpiredJobsCron);
    this.get('cron.DeleteExpiredJobsCron');
  }

  /**
   * Method to auto migrate database schema on app start
   */
  async migrateSchema(options?: { existingSchema?: 'drop' | 'alter' }) {
    const dbType = process.env.DB_TYPE || 'sqlite';
    const dsKey = dbType === 'mysql' ? 'datasources.MysqlDataSource' : 'datasources.SqliteDataSource';
    const ds = await this.get(dsKey) as any;

    if (options?.existingSchema === 'drop') {
      await ds.automigrate();
      console.log('Database schema dropped and recreated');
    } else {
      await ds.autoupdate();
      console.log('Database schema updated');
    }
  }
}
