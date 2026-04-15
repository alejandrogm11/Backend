import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AgmmssqlDataSource} from '../datasources';
import {UserRole, UserRoleRelations} from '../models';

export class UserRoleRepository extends DefaultCrudRepository<
  UserRole,
  typeof UserRole.prototype.id,
  UserRoleRelations
> {
  constructor(
    @inject('datasources.agmmssql') dataSource: AgmmssqlDataSource,
  ) {
    super(UserRole, dataSource);
  }
}

