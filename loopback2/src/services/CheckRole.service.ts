import { repository } from "@loopback/repository";
import { RoleRepository, UserRoleRepository } from "../repositories";
import { User } from "@loopback/authentication-jwt";


export async function checkRole(
  UserId: string,
  roleName: string,
  userRoleRepository: UserRoleRepository,
  roleRepository: RoleRepository
): Promise<boolean> {
  // Busca el rol por nombre
  const role = await roleRepository.findOne({
    where: { name: roleName }
  });

  //  Si no existe el rol, retorna false
  console.log('role:', role);

  if (!role) return false;

  console.log('DETRAS: roleId:', role.id);

  //  Busca si el usuario tiene ese rol
  const userRole = await userRoleRepository.findOne({
    where: {
      userId: UserId,
      roleId: role.id
    }
  });

  //  Retorna true si existe, false si no

  console.log('userRole:', userRole);
  return userRole !== null;
}
