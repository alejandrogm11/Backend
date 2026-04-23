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
  del,
  api,
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

@api({ basePath: '/api/' })
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
    return await this.userRoleRepository.create({
      userId: body.idUsuario,
      roleId: roleId,
    });
  }

  @del('/user-roles/delete')
  @authenticate('jwt-cookie')
  @response(204, {
    description: 'Product DELETE success',
  })
  async deletebyID(
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
  ): Promise<void> {
    const doesRoleExist = await this.roleChecker.checkRole(
      this.currentUserProfile[securityId],
      'Admin'
    );
    if (!doesRoleExist) {
      throw new HttpErrors.Unauthorized("You are not authorized");
    }
    await this.validateUserID.validateUserID(body.idUsuario);
    const roleId = await this.getRoleID.getRoleID(body.roleName);
    await this.userRoleRepository.deleteAll({
      roleId: roleId,
      userId: body.idUsuario,
    });
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
