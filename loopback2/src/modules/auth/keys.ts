import { BindingKey } from "@loopback/core"
import { AuthComponent } from "./components"
import { JugglerDataSource } from "@loopback/repository"
import { RoleChecker } from "./services/validations/CheckRole.service"
import { FindUserRoles } from "./services/roleFinder.service"
import { UserRoleService } from "./services/getAllRoles.service"
import { UserExist } from "./services/validations/CheckExistingUser.service"
import { FindAllAvailableUserRoles } from "./services/getAllAvailableUserRoles.service"
import { GetRoleID } from "./services/getRoleID.service"
import { ValidateUserID } from "./services/validations/validateUserID.service"

export namespace AuthBindings {

  export const ROLE_CHECKER = BindingKey.create<RoleChecker>('services.RoleChecker')
  export const ROLE_FINDER = BindingKey.create<FindUserRoles>('services.FindUserRoles')
  export const ALL_ROLE_FINDER = BindingKey.create<UserRoleService>('services.GetAllRoles')
  export const USER_EXIST = BindingKey.create<UserExist>('services.UserExist')
  export const CREATE_NEWUSER = BindingKey.create<UserExist>('services.CreateNewUser')
  export const GET_ALL_AVAILABLE_ROLES = BindingKey.create<FindAllAvailableUserRoles>('services.FindAllAvailableUserRoles')
  export const GET_ROLE_ID = BindingKey.create<GetRoleID>('services.GetRoleID')
  export const VAL_USER_ID = BindingKey.create<ValidateUserID>('services.ValidateUserID')

  /**
   * Binding key for AuthComponent
   */
  export const COMPONENT = BindingKey.create<AuthComponent>('components.AuthComponents')

  /**
   * Binding key for component DataSource
   */
  export const DATASOURCE = BindingKey.create<JugglerDataSource>(`auth`)

}
