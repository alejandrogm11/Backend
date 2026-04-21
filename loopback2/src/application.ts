import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { JugglerDataSource, RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import path from 'path';
import { MySequence } from './sequence';
import cookieParser from 'cookie-parser'


// Imports de autenticacion JWT
import { AuthenticationComponent, registerAuthenticationStrategy } from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import { AgmmssqlDataSource } from './datasources/agm-mssql.datasource';
import { UserRepository, UserCredentialsRepository } from './modules/auth/repositories';
import { JwtCookieStrategy } from './modules/auth/services/jwt-cookie.strategy';
import { UserRoleService } from './modules/auth/services/getAllRoles.service';
export { ApplicationConfig };
import dotenv from "dotenv";
import { AuthComponent } from './modules/auth/components';
import { FindUserRoles } from './modules/auth/services/roleFinder.service';
import { RoleChecker } from './modules/auth/services/validations/CheckRole.service';

dotenv.config();

export class Loopback2Application extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication)),) {
  constructor(options: ApplicationConfig = {}) {
    super({                              // ← cambia esta línea
      ...options,
      rest: {
        ...options.rest,
        cors: {
          origin: 'http://localhost:9000',
          credentials: true,
          allowedHeaders: ['Content-Type'],
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        },
      },
    });

    ((app) => {
      const datasource = new JugglerDataSource({
        name: 'agmmssql',
        connector: 'mssql',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 1433,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        options: {
          enableArithAbort: true
        }
      })
      app.dataSource(datasource)

      this.component(AuthComponent)
      this.dataSource(datasource, 'auth')

    })(this)



    // Set up the custom sequence
    this.sequence(MySequence);

    // Addinng Express Middleware
    this.expressMiddleware(cookieParser as any, {});

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    // ===== COMPONENTES DE AUTENTICACION JWT =====
    this.component(AuthenticationComponent);
    this.component(JWTAuthenticationComponent);
    registerAuthenticationStrategy(this, JwtCookieStrategy);

    // ===== DATASOURCE CONFIGURATION =====
    // El JWT component busca un datasource con clave 'datasources.db'
    // Registramos agmmssql como el datasource predeterminado
    this.bind('datasources.db').to(AgmmssqlDataSource);


    this.bind('services.UserRoleService').toClass(UserRoleService);

    // ===== BINDING DE REPOSITORIOS PARA JWT =====
    this.bind(UserServiceBindings.USER_REPOSITORY).toClass(UserRepository);
    this.bind(UserServiceBindings.USER_CREDENTIALS_REPOSITORY).toClass(UserCredentialsRepository);



    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    }
  }
}
