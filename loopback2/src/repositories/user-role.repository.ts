import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { AgmmssqlDataSource } from '../datasources';
import { UserRole, UserRoleRelations } from '../models';

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

  async findAllRolesByUserId(userId: string) {
    return this.dataSource.execute(`
    DECLARE @userId NVARCHAR(255) = '${userId}';
    SELECT r.name
    FROM Role r
    INNER JOIN Role_User ur ON ur.roleId = r.id
    WHERE ur.userId = @userId
  `);
  }

}
