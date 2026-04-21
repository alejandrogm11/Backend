import { inject } from '@loopback/core';
import { DefaultCrudRepository, JugglerDataSource } from '@loopback/repository';
import { User, UserCredentials, UserCredentialsRelations } from '@loopback/authentication-jwt';
import { AuthBindings } from '../keys';

export class UserCredentialsRepository extends DefaultCrudRepository<
  UserCredentials,
  typeof User.prototype.id,
  UserCredentialsRelations
> {
  constructor(
    @inject(`datasources.${AuthBindings.DATASOURCE.key}`)
    dataSource: JugglerDataSource,) {
    super(UserCredentials, dataSource);
  }
}
