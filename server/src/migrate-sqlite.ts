import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
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
import {UserRepository} from './repositories/user.repository';
import {AppliedJobsRepository} from './repositories/applied-jobs.repository';

// Datasources
import {SqliteDataSource} from './datasources/sqlite.datasource';

export class MigrationApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.projectRoot = __dirname;
  }
}

export async function migrate(args: string[]) {
  const existingSchema = args.includes('--rebuild') ? 'drop' : 'alter';
  console.log('Running migrations...');
  console.log(`Schema mode: ${existingSchema}`);
  
  const useExternalDb = process.env.USE_EXTERNAL_DB === 'true';
  if (useExternalDb) {
    console.log('⚠️  Using external MySQL database - run migrations on your MySQL server');
    process.exit(0);
  }

  const app = new MigrationApplication();
  await app.boot();

  const userRepository = await app.getRepository(UserRepository);
  const ds = userRepository.dataSource as SqliteDataSource;

  if (existingSchema === 'drop') {
    console.log('Dropping schema...');
    await ds.automigrate();
  } else {
    console.log('Altering schema...');
    await ds.autoupdate();
  }
  //added one console log to show the database file being used after migration
//added one console log to show the database file being used after migration
  console.log('✅ Migrations completed successfully!');
  console.log(`Database file: ${(ds as any).settings.file}`);
  process.exit(0);
}

migrate(process.argv.slice(2)).catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
