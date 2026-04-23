import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';
import 'dotenv/config';

const config = {
  name: 'agmmssql',
  connector: 'mssql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 1433,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  debug: true,
  options: {
    enableArithAbort: true
  }
};



// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class AgmmssqlDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'agmmssql';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.agmmssql', { optional: true })
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
