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
    public user: UserProfile,
    @service(RoleChecker)
    public roleChecker: RoleChecker,
  ) { }

  @post('/roles')
  @response(200, {
    description: 'Role model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Role) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, {
            title: 'NewRole',
            exclude: ['id'],
          }),
        },
      },
    })
    role: Omit<Role, 'id'>,
  ): Promise<Role> {
    return this.roleRepository.create(role);
  }

  @get('/roles/count')
  @response(200, {
    description: 'Role model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(Role) where?: Where<Role>,
  ): Promise<Count> {
    return this.roleRepository.count(where);
  }

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

  @patch('/roles')
  @response(200, {
    description: 'Role PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, { partial: true }),
        },
      },
    })
    role: Role,
    @param.where(Role) where?: Where<Role>,
  ): Promise<Count> {
    return this.roleRepository.updateAll(role, where);
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

  @patch('/roles/{id}')
  @response(204, {
    description: 'Role PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, { partial: true }),
        },
      },
    })
    role: Role,
  ): Promise<void> {
    await this.roleRepository.updateById(id, role);
  }

  @put('/roles/{id}')
  @response(204, {
    description: 'Role PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() role: Role,
  ): Promise<void> {
    await this.roleRepository.replaceById(id, role);
  }

  @del('/roles/{id}')
  @response(204, {
    description: 'Role DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.roleRepository.deleteById(id);
  }


  @get('/admin/available-roles/{userId}')
  @authenticate('jwt-cookie')
  @response(200, {
    description: 'All available roles for a user',
  })
  async getAvailableRoles(@param.path.number('userid') id: string): Promise<Role> {
    if (await this.roleChecker.checkRole(this.user[securityId], 'Admin')) {
      throw new HttpErrors.Unauthorized('You are Unauthorized')
    }
    return await this.findAllAvailableUserRoles.findAllAvailableUserRoles(id)
  }


}
