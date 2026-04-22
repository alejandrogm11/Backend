import { Binding, config, ContextTags, ControllerClass, CoreBindings, inject, injectable, ServiceOrProviderClass, type Component } from '@loopback/core';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { AuthBindings } from './keys';
import { RoleRepository, UserRoleRepository } from './repositories';
import { RoleController, UserController, UserRoleController } from './controllers';
import { User, UserCredentialsRepository, UserRepository } from '@loopback/authentication-jwt';
import { Role, UserRole } from './models';
import { AuthComponentConfig } from './types/config';
import { RoleChecker } from './services/validations/CheckRole.service';
import { FindUserRoles } from './services/roleFinder.service';
import { UserRoleService } from './services/getAllRoles.service';
import { UserExist } from './services/validations/CheckExistingUser.service';
import { CreateNewUser } from './services/CreateNewUser.service';
import { FindAllAvailableUserRoles } from './services/getAllAvailableUserRoles.service';
import { GetRoleID } from './services/getRoleID.service';
import { ValidateUserID } from './services/validations/validateUserID.service';
import { MailService } from './services/welcomeMailSender.service';



class DbApplication extends RepositoryMixin(RestApplication) { }

@injectable({ tags: { [ContextTags.KEY]: AuthBindings.COMPONENT.key } })
export class AuthComponent implements Component {

  models: [
    User,
    Role,
    UserRole
  ]

  repositories = [
    RoleRepository,
    UserRoleRepository,
    UserCredentialsRepository,
    UserRepository,
  ]

  controllers: ControllerClass[] = [
    UserController,
    UserRoleController,
    RoleController
  ];

  services?: ServiceOrProviderClass[] = [
    RoleChecker,
    FindUserRoles,
    UserRoleService,
    UserExist,
    CreateNewUser,
    FindAllAvailableUserRoles,
    GetRoleID,
    ValidateUserID,
    MailService,
  ]

  bindings: Binding[] = [
    
  ];

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private application: DbApplication,
    @config()
    componentConfig: AuthComponentConfig,
  ) {

  }

  async init() {
    console.log('✅ AuthComponent initialized');
  }


}
