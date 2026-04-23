// import { UserRepository } from "@loopback/authentication-jwt";
// import { injectable } from "@loopback/core";
// import { repository } from "@loopback/repository";


// @injectable()
// export class IsUserMailVerified {
//   constructor(
//     @repository(UserRepository)
//     private readonly userRepository: UserRepository
//   ) { }

//   async isUserMailVerified(userId: string) {
//     try {
//       const data = await this.userRepository.findById(userId)
//       const isVerified = data.emailVerified
//       if (!isVerified) {
//         return false
//       }
//     } catch (error) {
//       console.error(error)
//     }
//     return true
//   }
// }

import { injectable } from "@loopback/core";
import { repository } from "@loopback/repository";
import { UserRepository } from "../repositories";

@injectable()
export class IsUserMailVerified {
  constructor(
    @repository(UserRepository)
    private readonly userRepository: UserRepository
  ) { }

  async isUserMailVerified(userId: string): Promise<boolean> {
    console.log('=== CHECK MAIL VERIFIED DEBUG ===');
    console.log('UserId:', userId);

    try {
      const data = await this.userRepository.findById(userId);
      console.log('User data:', data);

      const isVerified = data.emailVerified;
      console.log('emailVerified:', isVerified);

      if (!isVerified) {
        return false;
      }
    } catch (error) {
      console.error('❌ Error en isUserMailVerified:', error);
      throw error;
    }
    return true;
  }
}
