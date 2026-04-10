import {Entity, model, property} from '@loopback/repository';

@model()
export class AgmOrders extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
    required: true,
  })
  orderId: number;

  @property({
    type: 'number',
    required: true,
  })
  amount: number;


  constructor(data?: Partial<AgmOrders>) {
    super(data);
  }
}

export interface AgmOrdersRelations {
  // describe navigational properties here
}

export type AgmOrdersWithRelations = AgmOrders & AgmOrdersRelations;
