import {Entity, model, property} from '@loopback/repository';

@model({settings: { strict: true}}) // para BBDD relacionales true - false para no relacionales
export class AgmUsers extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;


  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<AgmUsers>) {
    super(data);
  }
}

export interface AgmUsersRelations {
  // describe navigational properties here
}

export type AgmUsersWithRelations = AgmUsers & AgmUsersRelations;
