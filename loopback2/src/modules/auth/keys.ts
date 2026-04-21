import { BindingKey } from "@loopback/core"
import { AuthComponent } from "./components"
import { JugglerDataSource } from "@loopback/repository"
import { RoleChecker } from "./services/validations/CheckRole.service"
import { FindUserRoles } from "./services/roleFinder.service"
import { UserRoleService } from "./services/getAllRoles.service"

export namespace AuthBindings {

  export const ROLE_CHECKER = BindingKey.create<RoleChecker>('services.RoleChecker')
  export const ROLE_FINDER = BindingKey.create<FindUserRoles>('services.FindUserRoles')
  export const ALL_ROLE_FINDER = BindingKey.create<UserRoleService>('services.GetAllRoles')

  /**
   * Binding key for AuthComponent
   */
  export const COMPONENT = BindingKey.create<AuthComponent>('components.AuthComponents')

  /**
   * Binding key for component DataSource
   */
  export const DATASOURCE = BindingKey.create<JugglerDataSource>(`auth`)

}
