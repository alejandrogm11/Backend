import { UserRepository } from "@loopback/authentication-jwt";
import { injectable } from "@loopback/core";
import { repository } from "@loopback/repository";
import { HttpErrors } from "@loopback/rest";

injectable()
export class ValidateUserID{
  constructor(
    @repository(UserRepository)
    private readonly userRepository:UserRepository
  ) { }

  async validateUserID(userID:string) {
    try{
    const id = await this.userRepository.findById(userID)
      return id
    }catch{
      throw new HttpErrors.BadRequest('Invalid User')
    }
    
  }
}
