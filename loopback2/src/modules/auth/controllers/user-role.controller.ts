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
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import { Role, UserRole } from '../models';
import { UserRoleRepository, RoleRepository } from '../repositories';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
import { inject } from '@loopback/context'
import { authenticate } from '@loopback/authentication';
import { UserRoleService } from '../services/getAllRoles.service';
import { RoleChecker } from '../services/validations/CheckRole.service';
import { service } from '@loopback/core';
import { CreateUserRoleRequest, GetRoleID } from '../services/getRoleID.service';
import { ValidateUserID } from '../services/validations/validateUserID.service';

export class UserRoleController {
  constructor(
    @service(RoleChecker)
    public roleChecker: RoleChecker,
    @repository(UserRoleRepository)
    public userRoleRepository: UserRoleRepository,
    @repository(RoleRepository)
    public roleRepository: RoleRepository,
    @inject('services.UserRoleService')
    public userRoleService: UserRoleService,
    @inject(SecurityBindings.USER)
    public currentUserProfile: UserProfile,
    @service(GetRoleID)
    public getRoleID: GetRoleID,
    @service(ValidateUserID)
    public validateUserID: ValidateUserID,
  ) { }

  @post('/user-roles')
  @authenticate('jwt-cookie')
  @response(200, {
    description: 'UserRole model instance',
    content: { 'application/json': { schema: getModelSchemaRef(UserRole) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['idUsuario', 'roleName'],
            properties: {
              idUsuario: { type: 'string' },
              roleName: { type: 'string' },
            },
          },
        },
      },
    })
    body: CreateUserRoleRequest,
  ): Promise<UserRole> {
    const doesRoleExist = await this.roleChecker.checkRole(this.currentUserProfile[securityId], 'Admin',);
    if (!doesRoleExist) {
      throw new HttpErrors.Unauthorized("You are not authorized")
    }
    await this.validateUserID.validateUserID(body.idUsuario)
    const roleId = await this.getRoleID.getRoleID(body.roleName)
    return this.userRoleRepository.create({
      userId: body.idUsuario,
      roleId: roleId,
    });
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



  @get('/verify-owner')
  @authenticate('jwt-cookie')
  async verificarOwner(): Promise<{ isOwner: boolean }> {
    const userId = this.currentUserProfile[securityId];
    const doesRoleExist = await this.roleChecker.checkRole(userId, 'Owner',);
    if (!doesRoleExist) throw new HttpErrors.Unauthorized('User does not have the required role');
    return { isOwner: true };
  }


  @authenticate('jwt-cookie')
  @get('/users/obtainRoles/{id}')
  async getAllRolesByID(
    @param.path.string('id') id: string,
  ) {
    return this.userRoleService.getAllRoles(id);
  }

}
