import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';

// Repositories
import {CompaniesVisitedRepository} from './repositories/companies-visited.repository';
import {InterestedStudentsRepository} from './repositories/interested-students.repository';
import {OngoingJobsRepository} from './repositories/ongoing-jobs.repository';
import {SelectedStudentsRepository} from './repositories/selected-students.repository';
import {UserRepository} from './repositories/user.repository'; // ✅ added

// Datasource
import {MysqlDataSource} from './datasources';
// import { JWTService } from './service/services/jwt-service';
// import { AuthController } from './controllers/user.controller';
import { AuthenticationComponent, registerAuthenticationStrategy } from '@loopback/authentication';
import { JWTStrategy } from './strategies/jwt-strategies';
import { JWTService } from './service/jwt-service';
import { AuthController } from './controllers/auth.controller';
import { AppliedJobsRepository } from './repositories/applied-jobs.repository';
import { AppliedJobsController } from './controllers/applied-jobs.controllers';

export {ApplicationConfig};


export class ServerApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
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
        dirs: ['datasources'],         // ✅ Needed
        extensions: ['.datasource.js'],// ✅ Needed
        nested: true,
      },
    };
    

    // Bind datasource
    this.bind('datasources.MysqlDataSource').toClass(MysqlDataSource); // ✅ fixes it
    this.dataSource(MysqlDataSource); // keep this too, for default 'mysql' name
    
    // Bind repositories
    this.repository(CompaniesVisitedRepository);
    this.repository(AppliedJobsRepository);
    this.repository(InterestedStudentsRepository);
    this.repository(OngoingJobsRepository);
    this.repository(SelectedStudentsRepository);
    this.repository(UserRepository); // ✅ added
    this.bind('services.jwt.service').toClass(JWTService);
    // this.controller(UserLoginController);
    this.controller(AuthController);
    this.component(AuthenticationComponent);

    this.controller(AppliedJobsController);

    // Register the JWT authentication strategy
    registerAuthenticationStrategy(this, JWTStrategy);


  }

  /**
   * Method to auto migrate database schema on app start
   */

  async migrateSchema(options?: {existingSchema?: 'drop' | 'alter'}) {
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
