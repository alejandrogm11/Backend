import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import { Role, UserRole } from '../models';
import { UserRoleRepository } from '../repositories';
import { RoleRepository } from '../repositories/role.repository';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
import { inject } from '@loopback/context'
import { authenticate } from '@loopback/authentication';
import { checkRole } from '../services/CheckRole.service';
import { UserRoleService } from '../services/getAllRoles.service';

export class UserRoleController {
  constructor(
    @repository(UserRoleRepository)
    public userRoleRepository: UserRoleRepository,
    @repository(RoleRepository)
    public roleRepository: RoleRepository,
    @inject('services.UserRoleService')
    public userRoleService: UserRoleService,

  ) { }

  @post('/user-roles')
  @response(200, {
    description: 'UserRole model instance',
    content: { 'application/json': { schema: getModelSchemaRef(UserRole) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserRole, {
            title: 'NewUserRole',
            exclude: ['id'],
          }),
        },
      },
    })
    userRole: Omit<UserRole, 'id'>,
  ): Promise<UserRole> {
    return this.userRoleRepository.create(userRole);
  }

  @get('/user-roles/count')
  @response(200, {
    description: 'UserRole model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(UserRole) where?: Where<UserRole>,
  ): Promise<Count> {
    return this.userRoleRepository.count(where);
  }

  @get('/user-roles')
  @response(200, {
    description: 'Array of UserRole model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UserRole, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(UserRole) filter?: Filter<UserRole>,
  ): Promise<UserRole[]> {
    return this.userRoleRepository.find(filter);
  }

  @patch('/user-roles')
  @response(200, {
    description: 'UserRole PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserRole, { partial: true }),
        },
      },
    })
    userRole: UserRole,
    @param.where(UserRole) where?: Where<UserRole>,
  ): Promise<Count> {
    return this.userRoleRepository.updateAll(userRole, where);
  }

  @get('/user-roles/{id}')
  @response(200, {
    description: 'UserRole model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UserRole, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(UserRole, { exclude: 'where' }) filter?: FilterExcludingWhere<UserRole>
  ): Promise<UserRole> {
    return this.userRoleRepository.findById(id, filter);
  }

  @patch('/user-roles/{id}')
  @response(204, {
    description: 'UserRole PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserRole, { partial: true }),
        },
      },
    })
    userRole: UserRole,
  ): Promise<void> {
    await this.userRoleRepository.updateById(id, userRole);
  }

  @put('/user-roles/{id}')
  @response(204, {
    description: 'UserRole PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() userRole: UserRole,
  ): Promise<void> {
    await this.userRoleRepository.replaceById(id, userRole);
  }

  // @post('/verify-owner')
  // @authenticate('jwt-cookie')
  // async ejecutar(
  //   @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  //   @requestBody({
  //     required: true,
  //     content: {
  //       'application/json': {
  //         schema: {
  //           type: 'object',
  //           required: ['id'],
  //           properties: {
  //             id: {
  //               type: 'string',
  //             },
  //           },
  //         },
  //       },
  //     },
  //   })
  //   body: { id: string },
  // ) {

  //   const userId = currentUserProfile[securityId];

  //   const doesRoleExist = await checkRole(userId, 'Ownerrrrrr', this.userRoleRepository, this.roleRepository);
  //   if (!doesRoleExist) throw new HttpErrors.Unauthorized('User does not have the required role');


  //   const roles = await findUserRoles(body.id, this.userRoleRepository, this.roleRepository);
  //   const mappedRoles = roles.map(role => role.name);
  //   if (mappedRoles.includes('Owner')) {
  //     return { isOwner: true };
  //   }
  //   return { isOwner: false };
  // }


  @get('/verify-owner')
  @authenticate('jwt-cookie')
  async verificarOwner(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,)
    : Promise<{ isOwner: boolean }> {

    const userId = currentUserProfile[securityId];
    const doesRoleExist = await checkRole(userId, 'Owner', this.userRoleRepository, this.roleRepository);
    if (!doesRoleExist) throw new HttpErrors.Unauthorized('User does not have the required role');
    return { isOwner: true };
  }


  //
  @get('/users/obtainRoles/{id}')
  async getAllRolesByID(
    @param.path.string('id') id: string,
  ) {
    return this.userRoleService.getAllRoles(id);
  }








}
