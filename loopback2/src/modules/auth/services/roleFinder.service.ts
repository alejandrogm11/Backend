import { injectable } from "@loopback/core";
import { Role } from "../models/role.model";
import { RoleRepository } from "../repositories";
import { UserRoleRepository } from "../repositories/user-role.repository";
import { repository } from "@loopback/repository";


@injectable()
export class FindUserRoles {
  constructor(
    @repository(RoleRepository)
    private readonly roleRepository: RoleRepository,
    @repository(UserRoleRepository)
    private readonly userRoleRepository: UserRoleRepository
  ) { }

  async findUserRoles(
    userId: string,
  ): Promise<Role[]> {
    // Implementamos la lógica para encontrar lo que queremos que son los roles
    // usando la tabla intermedia UserRole

    // Encontramos los UserRoles asociados al userId
    const userRoles = await this.userRoleRepository.find({ where: { userId } });

    // Extraemos los roleIds del array de UserRoles
    const roleIds = userRoles.map((userRole) => userRole.roleId);

    // Si no hay roles asociados, retornamos un array vacío
    if (roleIds.length === 0) {
      return [];
    }

    // Buscamos los roles usando los IDs extraídos
    const roles = await this.roleRepository.find({
      where: {
        id: { inq: roleIds },
      },
    });


    return roles
  }
}
