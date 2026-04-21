import {inject} from '@loopback/core';
import {DefaultCrudRepository, JugglerDataSource} from '@loopback/repository';
import {Role, RoleRelations} from '../models';
import { AuthBindings } from '../keys';

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype.id,
  RoleRelations
> {
  constructor(
    @inject(`datasources.${AuthBindings.DATASOURCE.key}`)
    dataSource: JugglerDataSource,
  ) {
    super(Role, dataSource);
  }
}
