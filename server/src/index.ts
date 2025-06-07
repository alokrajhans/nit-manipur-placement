import {ApplicationConfig, ServerApplication} from './application';
import 'module-alias/register';

export * from './application';

export async function main(options: ApplicationConfig = {}) {
  const app = new ServerApplication(options);

  // Boot the application (load controllers, repositories, etc.)
  await app.boot();

  // Run database migrations before starting the server
  await app.migrateSchema();

  // Start the REST server
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}

if (require.main === module) {
  // Run the application with configuration from environment variables or defaults
  const config = {
    rest: {
      port: +(process.env.PORT ?? 10000),
      host: process.env.HOST || '0.0.0.0',
      // The `gracePeriodForClose` provides a graceful close for http/https servers with keep-alive clients.
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        setServersFromRequest: true,
      },
    },
  };

  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
