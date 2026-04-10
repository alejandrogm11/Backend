import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AgmmssqlDataSource} from '../datasources';
import { User, UserCredentials, UserCredentialsRelations } from '@loopback/authentication-jwt';

export class UserCredentialsRepository extends DefaultCrudRepository<
  UserCredentials,
  typeof User.prototype.id,
  UserCredentialsRelations
> {
  constructor(@inject('datasources.agmmssql') dataSource: AgmmssqlDataSource) {
    super(UserCredentials, dataSource);
  }
}
