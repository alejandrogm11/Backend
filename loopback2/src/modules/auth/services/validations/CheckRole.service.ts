
import { RoleRepository, UserRoleRepository } from "../../repositories"
import { injectable, inject } from '@loopback/core';
import { repository } from '@loopback/repository';

@injectable()
export class RoleChecker {
  constructor(
    @repository(UserRoleRepository)
    private readonly userRoleRepository: UserRoleRepository,
    @repository(RoleRepository)
    private readonly roleRepository: RoleRepository
  ) { }

  async checkRole(userId: string, roleName: string): Promise<boolean> {
    // Busca el rol por nombre
    const role = await this.roleRepository.findOne({
      where: { name: roleName }
    });

    // Si no existe el rol, retorna false
    if (!role) return false;

    // Busca si el usuario tiene ese rol
    const userRole = await this.userRoleRepository.findOne({
      where: {
        userId: userId,
        roleId: role.id
      }
    });

    // Retorna true si existe, false si no
    return userRole !== null;
  }
}
