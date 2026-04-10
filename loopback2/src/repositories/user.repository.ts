import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AgmmssqlDataSource} from '../datasources';
import { User, UserRelations } from '@loopback/authentication-jwt';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  constructor(@inject('datasources.agmmssql') dataSource: AgmmssqlDataSource) {
    super(User, dataSource);
  }
}
