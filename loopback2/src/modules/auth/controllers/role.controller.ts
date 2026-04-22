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
import { Role } from '../models';
import { RoleRepository } from '../repositories';
import { inject, service } from '@loopback/core';
import { FindAllAvailableUserRoles } from '../services/getAllAvailableUserRoles.service';
import { authenticate } from '@loopback/authentication';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
import { RoleChecker } from '../services/validations/CheckRole.service';

export class RoleController {
  constructor(
    @repository(RoleRepository)
    public roleRepository: RoleRepository,
    @service(FindAllAvailableUserRoles)
    public findAllAvailableUserRoles: FindAllAvailableUserRoles,
    @inject(SecurityBindings.USER)
    public currentUserProfile: UserProfile,
    @service(RoleChecker)
    public roleChecker: RoleChecker,
  ) { }


  @get('/roles')
  @response(200, {
    description: 'Array of Role model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Role, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Role) filter?: Filter<Role>,
  ): Promise<Role[]> {
    return this.roleRepository.find(filter);
  }


  @get('/roles/{id}')
  @response(200, {
    description: 'Role model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Role, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Role, { exclude: 'where' }) filter?: FilterExcludingWhere<Role>
  ): Promise<Role> {
    return this.roleRepository.findById(id, filter);
  }


  @authenticate('jwt-cookie')
  @get('/admin/available-roles/{id}')
  @response(200, {
    description: 'All available roles for a user',
  })
  async getAvailableRoles(@param.path.string('id') id: string): Promise<Role> {
    const hasRole = await this.roleChecker.checkRole(this.currentUserProfile[securityId], 'Admin');
    if (!hasRole) {
      throw new HttpErrors.Unauthorized('You are Unauthorized')
    }
    return await this.findAllAvailableUserRoles.findAllAvailableUserRoles(id)
  }


}
