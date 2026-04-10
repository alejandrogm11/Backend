import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import cookieParser from 'cookie-parser'


// Imports de autenticacion JWT
import {AuthenticationComponent} from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {AgmmssqlDataSource} from './datasources/agm-mssql.datasource';
import {UserRepository, UserCredentialsRepository} from './repositories';

export {ApplicationConfig};

export class Loopback2Application extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

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

// ===== DATASOURCE CONFIGURATION =====
// El JWT component busca un datasource con clave 'datasources.db'
// Registramos agmmssql como el datasource predeterminado
this.bind('datasources.db').to(AgmmssqlDataSource);

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
    };
  }
}
