import { repository } from "@loopback/repository";
import { UserRoleRepository } from "../repositories"


export class UserRoleService {
  constructor(
    @repository(UserRoleRepository)
    private userRoleRepository: UserRoleRepository,
  ) { }
  async getAllRoles(userId: string) {
    return this.userRoleRepository.findAllRolesByUserId(userId);
  }
}

