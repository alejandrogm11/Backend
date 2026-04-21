import {belongsTo, Entity, model, property} from '@loopback/repository';
import { Role } from "./role.model"
import { User } from '@loopback/authentication-jwt';

@model({
  name: 'Role_User',   // nombre dbo en la bbDD
  settings: {
    schema: 'dbo'
  }
})
export class UserRole extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => Role, {name: '$role', keyFrom: 'roleId', keyTo: 'id'})
  roleId: number;

  @belongsTo(() => User, {name: '$user', keyFrom: 'userId', keyTo: 'id'})
  userId: string;

  constructor(data?: Partial<UserRole>) {
    super(data);
  }
}

export interface UserRoleRelations {
  // describe navigational properties here
  
}

export type UserRoleWithRelations = UserRole & UserRoleRelations;
