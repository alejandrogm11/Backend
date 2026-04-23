import { UserRepository } from "@loopback/authentication-jwt";
import { injectable } from "@loopback/core";
import { repository } from "@loopback/repository";


@injectable()
export class IsUserMailVerified {
  constructor(
    @repository(UserRepository)
    private readonly userRepository: UserRepository
  ) { }

  async isUserMailVerified(userId: string) {
    try {
      const data = await this.userRepository.findById(userId)
      const isVerified = data.emailVerified
      if (!isVerified) {
        return false
      }
    } catch (error) {
      console.error(error)
    }
    return true
  }
}
