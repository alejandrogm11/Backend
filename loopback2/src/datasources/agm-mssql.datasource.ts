import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'agmmssql',
  connector: 'mssql',
  url: 'mssql://pruebassSQL:MiContraseñaSegura123!@localhost/AGMPRUEBAS',
  host: 'localhost',
  port: 1433,
  user: 'pruebassSQL',
  password: 'MiContraseñaSegura123!',
  database: 'AGMPRUEBAS',
  options: {
    enableArithAbort: false
  },
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
    @inject('datasources.config.agmmssql', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
