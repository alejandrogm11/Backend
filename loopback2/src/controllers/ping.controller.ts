// import { authenticate } from '@loopback/authentication';
// import { inject } from '@loopback/core';
// import {
//   Request,
//   RestBindings,
//   get,
//   response,
//   ResponseObject,
//   HttpErrors,
// } from '@loopback/rest';
// import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
// import { checkRole } from '../services/CheckRole.service';
// import { RoleRepository, UserRoleRepository } from '../repositories';
// import { repository } from '@loopback/repository';

// /**
//  * OpenAPI response for ping()
//  */
// const PING_RESPONSE: ResponseObject = {
//   description: 'Ping Response',
//   content: {
//     'application/json': {
//       schema: {
//         type: 'object',
//         title: 'PingResponse',
//         properties: {
//           greeting: { type: 'string' },
//           date: { type: 'string' },
//           url: { type: 'string' },
//           headers: {
//             type: 'object',
//             properties: {
//               'Content-Type': { type: 'string' },
//             },
//             additionalProperties: true,
//           },
//         },
//       },
//     },
//   },
// };

// /**
//  * A simple controller to bounce back http requests
//  */
// export class PingController {
//   constructor
//     (@inject(RestBindings.Http.REQUEST) private req: Request,
//       @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
//       @repository(UserRoleRepository)
//       public userRoleRepository: UserRoleRepository,
//       @repository(RoleRepository)
//       public roleRepository: RoleRepository,) { }

//   // Map to `GET /ping`
//   @get('/ping')
//   @response(200, PING_RESPONSE)
//   @authenticate('jwt-cookie')
//   async ping(
//     @inject(SecurityBindings.USER) currentUserProfile: UserProfile
//   ): Promise<object> {

//     const userId = currentUserProfile[securityId];

//     const doesRoleExist = await checkRole(userId, 'Owner', this.userRoleRepository, this.roleRepository);
//     if (!doesRoleExist) throw new HttpErrors.Unauthorized('User does not have the required role');

//     return {
//       greeting: 'Hello from LoopBack',
//       date: new Date(),
//       url: this.req.url,
//       headers: Object.assign({}, this.req.headers),
//     };
//   }
// }

import { get } from '@loopback/rest';

export class PingController {
  constructor() { }

  // Map to `GET /ping`
  @get('/ping', {
    responses: {
      '200': {
        description: 'Ping Response',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                greeting: { type: 'string' },
                date: { type: 'string' },
                url: { type: 'string' },
                headers: {
                  type: 'object',
                  additionalProperties: true,
                },
              },
            },
          },
        },
      },
    },
  })
  ping(): object {
    return {
      greeting: 'Hello from LoopBack',
      date: new Date(),
      url: '',
      headers: {},
    };
  }
}
