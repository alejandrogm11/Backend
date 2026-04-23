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
    try {
      const user = await this.userRepository.findById(userId);
      console.log('UPDATE, User found,', {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        verificationToken: user.verificationToken,
        tokenExpireDate: user.tokenExpireDate,
      });
      const expireDate = await this.getUserExpireDate(userId)

      // Si no hay fecha de expiración, el token es inválido
      console.log("Fecha de expiracion", expireDate)
      if (!expireDate) {
        return false;
      }

      //Convertir a date
      const expire = new Date(expireDate[0].tokenExpireDate)
      const now = new Date()

      // Verificar si el token aún es válido
      if (expire > now) {
        console.log("Verificado", true)
        await this.userRepository.execute(`          
          UPDATE [User]
          SET
            emailVerified= 1,
            tokenExpireDate= '2007-01-01T00:00:00.000Z'
          WHERE
          id = '${userId}';`
        );
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error validating user token:', error);
      return false;
    }
  }

  async getUserExpireDate(userId: string) {
    const date = await this.userRepository.execute(
      `SELECT tokenExpireDate
      FROM [User]
      WHERE id = '${userId}'`
    )
    return date
  }
}


