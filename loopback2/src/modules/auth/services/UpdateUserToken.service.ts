import { injectable } from "@loopback/core";
import { repository } from "@loopback/repository";
import { UserRepository } from "../repositories";
import * as Crypto from 'crypto';
import { User } from "@loopback/authentication-jwt";

@injectable()
export class UpdateUserToken {
  constructor(
    @repository(UserRepository)
    private readonly userRepository: UserRepository
  ) { }

  async updateUserToken(userId: string): Promise<string> {
    const token = Crypto.randomBytes(32).toString("hex");
    const date = new Date();
    const expireTime = new Date(Date.now() + 3600000).toISOString(); // 1h en ms
    console.log("fechaISO", expireTime)

    try {
      const found = await this.userRepository.findById(userId)

      // const dto:User = {
      //   ...found as User
      // }

      // {
      //   id: userId,
      //     verificationToken: token,
      //       tokenExpireDate: expireTime,  // ← CONVERTIR A STRING ISO
      // }


      found.verificationToken = token
      found.tokenExpireDate = "Prueba123"

      const result = await this.userRepository.execute(`
        UPDATE [User]
        SET
          verificationToken= '${token}',
          tokenExpireDate= '${expireTime}'
        WHERE 
        id = '${userId}';`
      )
      console.log('✓ Token y fecha actualizados correctamente');
    } catch (error) {
      console.error('❌ Error en updateUserToken:', error);
      throw error;
    }

    return token;
  }
}

