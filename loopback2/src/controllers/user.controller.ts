import {authenticate, TokenService} from '@loopback/authentication';
import {
  Credentials,
  MyUserService,
  TokenServiceBindings,
  User,
  UserRepository,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {model, property, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  post,
  requestBody,
  response,
  SchemaObject,
  RestBindings,
  Response
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import {UserCredentialsRepository} from '@loopback/authentication-jwt';




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
    rememberMe: {type: 'boolean'}
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository) 
    protected userRepository: UserRepository,
    @repository(UserCredentialsRepository) 
    protected userCredentialsRepository: UserCredentialsRepository,
    @inject(RestBindings.Http.RESPONSE)
    private response: Response,
    
  ) {}

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
    @requestBody(CredentialsRequestBody) credentials: Credentials & {rememberMe?: boolean},
  ): Promise<object> {
    try{


    //verifica credenciales y genera el token

    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);
    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);

    const maxAge = credentials.rememberMe
    ? 30 * 24 * 60 * 60 * 1000  // 30 días en ms
    : 60 * 60 * 1000;            // 1 hora en ms

    //en lugar de devolver el token, lo metemos en una cookie httpOnly
    this.response.cookie('access_Token', token, {
      httpOnly: true, // JS del navegador nunca puede leerla
      secure: process.env.NODE_ENV === 'production', // solo HTTPS en producción
      sameSite: 'strict',
      maxAge : maxAge,
      path: '/',
    });

    return {
      Message: 'Succesful Login',
      user: {
        id: userProfile[securityId],
      },
    };


    // Debug
    } catch(error){
      console.error('Login error:', error)
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
    const user = await this.userRepository.findById(userId)

    return {
    id: user.id,
    email: user.email
    }
    
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
    const password = await hash(newUserRequest.password, await genSalt());
    const savedUser = await this.userRepository.create(
      _.omit(newUserRequest, ['password', 'id']),
    );
  
    // Introduce el 
  await this.userCredentialsRepository.create({
  password,
  userId: savedUser.id,
  });


    // await this.userRepository.userCredentials(savedUser.id).create({password});

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
              message: {type: 'string'},
            },
          },
        },
      },
    },
  },
})
async logout() : Promise<object> {
    this.response.clearCookie('access_Token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })
  return {message: 'Logout Succesful'}
}







}
