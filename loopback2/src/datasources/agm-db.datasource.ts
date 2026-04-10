import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

// const config = {
//   name: 'agmDB',
//   connector: 'json',
//   file: 'data/agmDB.json',
// };



const config = {
  name: 'agmDB',
  connector: 'memory',
  localStorage: '',  
  file: './data/agmDB.json',
  
};



@lifeCycleObserver('datasource')
export class AgmDbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'agmDB';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.agmDB', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);

  }
}
