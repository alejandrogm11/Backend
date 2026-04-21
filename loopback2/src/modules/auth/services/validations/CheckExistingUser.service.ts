import { UserRepository } from "@loopback/authentication-jwt";
import { injectable } from "@loopback/core";
import { repository } from "@loopback/repository";
import { HttpErrors } from "@loopback/rest";
import { setSourceMapsEnabled } from "process";



@injectable()
export class UserExist{
  constructor(
    @repository(UserRepository)
    private readonly userRepository: UserRepository
  ) { }

  async findExistingUser(username: string){
    const foundUser = await this.userRepository.findOne({
      where: {username: username} // Busca el usuario en la BBDD
    })
    if (foundUser){
      throw new HttpErrors.Conflict('User already exists')
    }
  }
}
