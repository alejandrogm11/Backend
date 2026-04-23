import { authenticate, TokenService } from '@loopback/authentication';
import {
  Credentials,
  MyUserService,
  TokenServiceBindings,
  User,
  UserRepository,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import { inject, service } from '@loopback/core';
import { Filter, model, property, repository } from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  post,
  requestBody,
  SchemaObject,
  RestBindings,
  Response,
  HttpErrors,
  param,
  api
} from '@loopback/rest';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
import { genSalt, hash } from 'bcryptjs';
import _ from 'lodash';
import { UserCredentialsRepository } from '@loopback/authentication-jwt';
import { validateSignupData } from '../services/validations/signupValidationSchema.service';
import { RoleRepository, UserRoleRepository } from '../repositories';
import { RoleChecker } from '../services/validations/CheckRole.service';
import { FindUserRoles } from '../services/roleFinder.service';
import { UserExist } from '../services/validations/CheckExistingUser.service';
import { CreateNewUser } from '../services/CreateNewUser.service';
import { MailService } from '../services/welcomeMailSender.service';
import { IsUserMailVerified } from '../services/isUserMailVerified.service';
import { UpdateUserToken } from '../services/UpdateUserToken.service';
import { ValidateUserToken } from '../services/validations/validateUserToken.service';



@model()
export class NewUserRequest extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
    rememberMe: { type: 'boolean' }
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': { schema: CredentialsSchema },
  },
};
@api({ basePath: '/api/' })
export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, { optional: true })
    public user: UserProfile,
    @repository(UserRepository)
    protected userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    protected userCredentialsRepository: UserCredentialsRepository,
    @inject(RestBindings.Http.RESPONSE)
    private response: Response,
    @repository(UserRoleRepository)
    public userRoleRepository: UserRoleRepository,
    @repository(RoleRepository)
    public roleRepository: RoleRepository,
    @service(FindUserRoles)
    public findUserRoles: FindUserRoles,
    @service(UserExist)
    public userExist: UserExist,
    @service(CreateNewUser)
    public createNewUser: CreateNewUser,
    @service(MailService)
    public mailService: MailService,
    @service(IsUserMailVerified)
    public isuserMailVerified: IsUserMailVerified,
    @service(UpdateUserToken)
    public updateUserToken: UpdateUserToken,
    @service(ValidateUserToken)
    public validateUserToken: ValidateUserToken,
  ) { }

  @post('/auth/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody)
    credentials: Credentials & { rememberMe?: boolean },
  ): Promise<object> {
    try {
      //verifica credenciales y genera el token

      // ensure the user exists, and the password is correct
      const user = await this.userService.verifyCredentials(credentials);
      // convert a User object into a UserProfile object (reduced set of properties)
      const userProfile = this.userService.convertToUserProfile(user);

      // create a JSON Web Token based on the user profile
      const token = await this.jwtService.generateToken(userProfile);

      const maxAge = credentials.rememberMe
        ? 30 * 24 * 60 * 60 * 1000 // 30 días en ms
        : 60 * 60 * 1000; // 1 hora en ms

      //en lugar de devolver el token, lo metemos en una cookie httpOnly
      this.response.cookie('access_Token', token, {
        httpOnly: true, // JS del navegador nunca puede leerla
        secure: process.env.NODE_ENV === 'production', // solo HTTPS en producción
        sameSite: 'strict',
        maxAge: maxAge,
        path: '/',
      });

      return {
        Message: 'Succesful Login',
        user: {
          id: userProfile[securityId],
        },
      };

      // Debug
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  @authenticate('jwt-cookie')
  @get('/auth/me', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<object> {
    const userId = currentUserProfile[securityId];

    // Se hace consulta a BBDD para encontrar el
    const user = await this.userRepository.findById(userId);

    return {
      id: user.id,
      email: user.email,
    };
  }

  @post('/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<User> {

    const result = validateSignupData(newUserRequest);
    if (!result.success) {
      throw new HttpErrors.UnprocessableEntity('Unprocessable Entity / Invalid data');
    }
    // Comprobamos si el usuario existe en BBDD
    if (await this.userExist.findExistingUser(newUserRequest.username)) {
      throw new HttpErrors.Conflict("Credentials already exist")
    }

    // Se hashea la password y la introducimos en BBDD
    const password = await hash(newUserRequest.password, await genSalt());
    const savedUser = await this.userRepository.create(
      _.omit(newUserRequest, ['password', 'id']),
    );

    // Introduce usuario en BBDD
    this.createNewUser.createNewUser(savedUser.id, password)

    //Mail de bienvenida
    this.mailService.sendSignUpMail(savedUser.email)

    return savedUser;
  }

  @post('/auth/logout', {
    responses: {
      '200': {
        description: 'Logout exitoso',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string' },
              },
            },
          },
        },
      },
    },
  })
  async logout(): Promise<object> {
    this.response.clearCookie('access_Token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    return { message: 'Logout Succesful' };
  }


  @authenticate('jwt-cookie')
  @get('/admin/users', {
    responses: {
      '200': {
        description: 'Return all Users',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  }
  ) async getAllUsers(
    @service(RoleChecker) roleChecker: RoleChecker,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @param.filter(User) filter?: Filter<User>,
  ) {
    const userId = currentUserProfile[securityId]
    const doesRoleExist = await roleChecker.checkRole(userId, 'Admin');
    if (!doesRoleExist) throw new HttpErrors.Unauthorized('User does not have the required role');
    return this.userRepository.find(filter)

  }

  @get('/mail/send', {
    responses: {
      '200': {
        description: 'Return all Users',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  }
  )
  async sendWelcomeMail(
  ) {
    this.mailService.sendWelcomeMail();
  }

  @authenticate('jwt-cookie')
  @get('/auth/check-verify-mail', {
    responses: {
      '200': {
        description: 'Return all Users',
        content: {
          'application/json': {
            schema: {
              type: 'boolean',
            },
          },
        },
      },
    },
  }
  ) async checkVerifiedMail(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ) {
    return await this.isuserMailVerified.isUserMailVerified(currentUserProfile[securityId])
  }

  @authenticate('jwt-cookie')
  @get('/auth/verify-mail', {
    responses: {
      '200': {
        description: 'Sends email for verification',
        content: {
          'application/json': {
            schema: {
              type: 'boolean',
            },
          },
        },
      },
    },
  }) async verifyMailSend(@inject(SecurityBindings.USER) currentUserProfile: UserProfile,) {
    const user = await this.userRepository.findById(currentUserProfile[securityId])
    const token = await this.updateUserToken.updateUserToken(currentUserProfile[securityId])
    const userId = this.mailService.sendVerifyEmail(user.email, token)
  }

  @authenticate('jwt-cookie')
  @get('/auth/verify-token', {
    responses: {
      '200': {
        description: 'Ckecks ',
        content: {
          'application/json': {
            schema: {
              type: 'boolean',
            },
          },
        },
      },
    },
  }) async verifyMail(@param.query.string('token') token: string,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,) {
    this.validateUserToken.validateUserToken(currentUserProfile[securityId])
  }




  //FIN--------------------------------
}




