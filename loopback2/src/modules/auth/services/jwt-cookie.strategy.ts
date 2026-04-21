import {AuthenticationStrategy, TokenService} from '@loopback/authentication';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';

export class JwtCookieStrategy implements AuthenticationStrategy {
  name = 'jwt-cookie';


  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public tokenService: TokenService,
  ) {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {


    // en lugar de mirar request.headers.authorization, miramos la cookie
    const token: string = request.cookies?.access_Token;



    if (!token) {
      throw new HttpErrors.Unauthorized('No active session');
    }

    // El resto es igual — verifica el token con el mismo servicio JWT
    const userProfile = await this.tokenService.verifyToken(token);
    return userProfile;
  }
}
