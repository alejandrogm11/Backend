import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AgmmssqlDataSource} from '../datasources';
import {AgmOrders, AgmOrdersRelations} from '../models';

export class AgmOrdersRepository extends DefaultCrudRepository<
  AgmOrders,
  typeof AgmOrders.prototype.orderId,
  AgmOrdersRelations
> {
  constructor(
    @inject('datasources.agmmssql') dataSource: AgmmssqlDataSource,
  ) {
    super(AgmOrders, dataSource);
  }
}
