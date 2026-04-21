import { injectable } from "@loopback/core";
import { UserRoleRepository } from "../repositories";
import { repository } from "@loopback/repository";

@injectable()
export class FindAllAvailableUserRoles{
  constructor(
  @repository(UserRoleRepository)
  private readonly userRoleRepository: UserRoleRepository
  ){ }

  async findAllAvailableUserRoles(userId: string){
    return await this.userRoleRepository.findAvailableRolesByUserId(userId)
  }
}
