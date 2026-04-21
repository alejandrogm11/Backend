import { injectable } from "@loopback/core";
import { repository } from "@loopback/repository";
import { RoleRepository } from "../repositories";
import { HttpErrors } from "@loopback/rest";
import { strict } from "assert";
import { int } from "zod";
import { integer } from "zod/v4/core/regexes.cjs";


@injectable()
export class GetRoleID {
  constructor(
    @repository(RoleRepository)
    private readonly roleRepository: RoleRepository
  ) { }
  async getRoleID(name: string): Promise<number> {
    const role = await this.roleRepository.findOne({
      where: { name: name }
    })
    const roleID = role?.id
    if (!roleID) {
      throw new HttpErrors.BadRequest('Rol no asignable')
    }

    return roleID
  }
}


export type CreateUserRoleRequest = {
  idUsuario: string;
  roleName: string;
};
