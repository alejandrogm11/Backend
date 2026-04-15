import {Entity, model, property} from '@loopback/repository';

@model()
export class UserRole extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  roleId: number;

  @property({
    type: 'number',
    required: true,
  })
  userId: string;


  constructor(data?: Partial<UserRole>) {
    super(data);
  }
}

export interface UserRoleRelations {
  // describe navigational properties here
}

export type UserRoleWithRelations = UserRole & UserRoleRelations;
