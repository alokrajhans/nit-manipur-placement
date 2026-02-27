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
import { MysqlDataSource } from './datasources';

// Auth
import { AuthenticationComponent, registerAuthenticationStrategy } from '@loopback/authentication';
import { JWTStrategy } from './strategies/jwt-strategies';
import { JWTService } from './service/jwt-service';
import { AuthController } from './controllers/auth.controller';
import { AppliedJobsController } from './controllers/applied-jobs.controllers';
import { DeleteExpiredJobsCron } from './cron/deleteExpiredJobs.cron';

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
      datasources: {
        dirs: ['datasources'],
        extensions: ['.datasource.js'],
        nested: true,
      },
    };

    // Bind and configure MySQL datasource
    this.bind('datasources.MysqlDataSource').toClass(MysqlDataSource);
    this.dataSource(MysqlDataSource);

    // Bind repositories
    this.repository(CompaniesVisitedRepository);
    this.repository(AppliedJobsRepository);
    this.repository(InterestedStudentsRepository);
    this.repository(OngoingJobsRepository);
    this.repository(SelectedStudentsRepository);
    this.repository(UserRepository);

    // Auth services
    this.bind('services.jwt.service').toClass(JWTService);
    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, JWTStrategy);

    // Register controllers
    this.controller(AuthController);
    this.controller(AppliedJobsController);

    // ✅ Register cron job
    // Register cron job
    this.bind('cron.DeleteExpiredJobsCron').toClass(DeleteExpiredJobsCron);
    this.get('cron.DeleteExpiredJobsCron');
  }

  /**
   * Method to auto migrate database schema on app start
   */
  async migrateSchema(options?: { existingSchema?: 'drop' | 'alter' }) {
    const ds = await this.get('datasources.mysql') as MysqlDataSource;

    if (options?.existingSchema === 'drop') {
      await ds.automigrate();
      console.log('Database schema dropped and recreated');
    } else {
      await ds.autoupdate();
      console.log('Database schema updated');
    }
  }
}
