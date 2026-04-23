import { UserRepository } from "@loopback/authentication-jwt";
import { injectable } from "@loopback/core";
import { repository } from "@loopback/repository";
import * as Crypto from 'crypto'

@injectable()
export class UpdateUserToken {
  constructor(
    @repository(UserRepository)
    private readonly userRepository: UserRepository
  ) { }

  async updateUserToken(userId: string): Promise<string> {
    const token = Crypto.randomBytes(32).toString("hex")
    try {
      await this.userRepository.updateById(userId, {
        verificationToken: token
      });
      await this.updateTokenExpireDate(userId);
    } catch (error) {
      console.error(error)
    }
    return token
  }

  async updateTokenExpireDate(userId: string): Promise<void> {
    const date = new Date()
    const expiretime = new Date(date.getTime() + 3600000) // 1h en ms 
    try {
      await this.userRepository.updateById(userId, {
        tokenExpireDate: expiretime
      })
    } catch (error) {
      console.error(error)
    }
  }
}
