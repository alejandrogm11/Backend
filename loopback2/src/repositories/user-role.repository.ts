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

export async function FindUserRoles(params: { userId: string }, userRoleRepository: UserRoleRepository): Promise<UserRole[]> {
  const mappings = await userRoleRepository.find({
    where: { userId: params.userId },
  });

  const roleIds = mappings.map(mapping => mapping.roleId);

  const roles = await userRoleRepository.find({
    where: { id: { inq: roleIds } },
  });
  
  return roles.map(role => role.name)
}
