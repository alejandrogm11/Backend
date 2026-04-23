import { UserRepository } from "@loopback/authentication-jwt";
import { inject, injectable } from "@loopback/core";
import { repository } from "@loopback/repository";


@injectable()
export class ValidateUserToken {
  constructor(
    @repository(UserRepository)
    private readonly userRepository: UserRepository
  ) { }
  async validateUserToken(userId: string): Promise<boolean> {
    let isTokenValid = false
    try {
      const user = await this.userRepository.findById(userId)
      const expiredate = user.tokenExpireDate

      const alreadyExpiredDate = new Date("2007-01-01T00:00:00Z")
      const dateToCompare = expiredate ?? alreadyExpiredDate;

      if (dateToCompare.getTime() > new Date().getTime()) {
        this.userRepository.updateById(userId, {
          emailVerified: true
        })
        isTokenValid = true
        return isTokenValid
      }

    }
    catch (error) {
      console.error(error)
    }
    return isTokenValid
  }

}
