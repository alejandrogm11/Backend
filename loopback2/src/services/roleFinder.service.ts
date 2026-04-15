import { Role } from "../models/role.model";
import { RoleRepository } from "../repositories";
import {UserRoleRepository} from "../repositories/user-role.repository";



export async function findUserRoles(
  userId: string,
  userRoleRepository: UserRoleRepository,
  roleRepository: RoleRepository,
): Promise<Role[]> 
 {
  // Implementamos la lógica para encontrar lo que queremos que son los roles
  // usando la tabla intermedia UserRole

  // Encontramos los UserRoles asociados al userId
  const userRoles = await userRoleRepository.find({where: {userId}});

  // Extraemos los roleIds del array de UserRoles
  const roleIds = userRoles.map((userRole) => userRole.roleId);

  // Si no hay roles asociados, retornamos un array vacío
  if (roleIds.length === 0) {
    return [];
  }

  // Buscamos los roles usando los IDs extraídos
  const roles = await roleRepository.find({
    where: {
      id: {inq: roleIds},
    },
  });


  return roles
}
