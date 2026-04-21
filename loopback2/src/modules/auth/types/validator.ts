import { User } from "@loopback/authentication-jwt";
import { Role } from "../models";
import { Bootable } from "@loopback/boot";

export interface IUserValidator {
  isValid(object: User): Promise<Boolean>
}

export interface IRoleValidator {
  isValid(object: Role): Promise<Boolean>
}
