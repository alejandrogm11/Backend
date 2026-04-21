import { UserCredentials, UserCredentialsRepository } from "@loopback/authentication-jwt";
import { injectable } from "@loopback/core";
import { repository } from "@loopback/repository";
import { UserRoleRepository } from "../repositories";


@injectable()
export class CreateNewUser{
  constructor(
    @repository(UserCredentialsRepository)
    private readonly userCredentialsRepository: UserCredentialsRepository,
    @repository(UserRoleRepository)
    private readonly userRoleRepository: UserRoleRepository
  ) { }

  async createNewUser(id:string, password:any){

    // Introduce el usuario en la bbdd
    await this.userCredentialsRepository.create({
      password,
      userId: id,
    });

    // Damos el rol por defecto AUSER
    await this.userRoleRepository.create({
      userId: id,
      roleId: 3,
    });

    
  }
}

