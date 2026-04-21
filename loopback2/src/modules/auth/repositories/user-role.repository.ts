import { inject } from '@loopback/core';
import { DefaultCrudRepository, JugglerDataSource } from '@loopback/repository';
import { UserRole, UserRoleRelations } from '../models';
import { AuthBindings } from '../keys';

export class UserRoleRepository extends DefaultCrudRepository<
  UserRole,
  typeof UserRole.prototype.id,
  UserRoleRelations
> {
  constructor(
    @inject(`datasources.${AuthBindings.DATASOURCE.key}`)
    dataSource: JugglerDataSource,
  ) {
    super(UserRole, dataSource);
  }

  async findAllRolesByUserId(userId: string) {
    return this.dataSource.execute(`
    DECLARE @userId NVARCHAR(255) = '${userId}';
    SELECT r.name
    FROM Role r
    INNER JOIN Role_User ur ON ur.roleId = r.id
    WHERE ur.userId = @userId
  `);
  }
  async findAvailableRolesByUserId(userId: string) {
    return this.dataSource.execute(`
    DECLARE @userId NVARCHAR(255) = '${userId}';

    SELECT r.name FROM Role
    WHERE r.name NOT IN (
      SELECT r.name
      FROM Role r
      INNER JOIN Role_User ur ON ur.roleId = r.id
      WHERE ur.userId = @userId
      )
  `);
  }



}
