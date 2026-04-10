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
} from '@loopback/rest';
import {AgmOrders} from '../models';
import {AgmOrdersRepository} from '../repositories';



// Comienzo de clase
export class AgmOrderControllerController {
  constructor(
    @repository(AgmOrdersRepository)
    public repo : AgmOrdersRepository,
  ) {}

  @post('/agm-orders')
  @response(200, {
    description: 'AgmOrders model instance',
    content: {'application/json': {schema: getModelSchemaRef(AgmOrders)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AgmOrders, {
            title: 'NewAgmOrders',
            
          }),
        },
      },
    })
    agmOrders: AgmOrders,
  ): Promise<AgmOrders> {
    return this.repo.create(agmOrders);
  }

  @get('/agm-orders/count')
  @response(200, {
    description: 'AgmOrders model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(AgmOrders) where?: Where<AgmOrders>,
  ): Promise<Count> {
    return this.repo.count(where);
  }

  // @get('/agm-orders')
  // @response(200, {
  //   description: 'Array of AgmOrders model instances',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'array',
  //         items: getModelSchemaRef(AgmOrders, {includeRelations: true}),
  //       },
  //     },
  //   },
  // })

  // Get
@get('/agm-orders')
@response(200, {
  description: 'Hola buenas',
  content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(AgmOrders, { includeRelations: true }),
        },
      },
    },
  })
  //async find(@param.filter(AgmOrders) filter?: Filter<AgmOrders>): Promise<AgmOrders[]> {
  async find(): Promise<AgmOrders[]>{
    const found = await this.repo.find()
    return found
  }

  //   content: {


  // async find(
  //   @param.filter(AgmOrders) filter?: Filter<AgmOrders>,
  // ): Promise<AgmOrders[]> {
  //   return this.repo.find(filter);
  // }

  @patch('/agm-orders')
  @response(200, {
    description: 'AgmOrders PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AgmOrders, {partial: true}),
        },
      },
    })
    agmOrders: AgmOrders,
    @param.where(AgmOrders) where?: Where<AgmOrders>,
  ): Promise<Count> {
    return this.repo.updateAll(agmOrders, where);
  }

  @get('/agm-orders/{id}')
  @response(200, {
    description: 'AgmOrders model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(AgmOrders, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(AgmOrders, {exclude: 'where'}) filter?: FilterExcludingWhere<AgmOrders>
  ): Promise<AgmOrders> {
    return this.repo.findById(id, filter);
  }

  @patch('/agm-orders/{id}')
  @response(204, {
    description: 'AgmOrders PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AgmOrders, {partial: true}),
        },
      },
    })
    agmOrders: AgmOrders,
  ): Promise<void> {
    await this.repo.updateById(id, agmOrders);
  }

  @put('/agm-orders/{id}')
  @response(204, {
    description: 'AgmOrders PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() agmOrders: AgmOrders,
  ): Promise<void> {
    await this.repo.replaceById(id, agmOrders);
  }

  @del('/agm-orders/{id}')
  @response(204, {
    description: 'AgmOrders DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.repo.deleteById(id);
  }
}
