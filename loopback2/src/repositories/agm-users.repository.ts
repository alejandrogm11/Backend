import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AgmmssqlDataSource} from '../datasources';
import {AgmUsers, AgmUsersRelations} from '../models';

export class AgmusersRepository extends DefaultCrudRepository<
  AgmUsers,
  typeof AgmUsers.prototype.id,
  AgmUsersRelations
> {
  constructor(@inject('datasources.agmmssql') dataSource: AgmmssqlDataSource) {
    super(AgmUsers, dataSource);
  }
}
