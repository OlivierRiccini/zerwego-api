const debug = require('debug')('http');
import {JsonController, Body, Post, Res, HeaderParam, Put, Params, Param} from "routing-controllers";
import { IUser, IUserCredentials, IForgotPassword, IPhone } from "../models/user-model";
import { Service, Inject } from "typedi";
// import { AuthService } from "../services/auth-service";
// import { SecureService } from "../services/secure-service";

@JsonController('/users')
@Service()
export class UserController {
//   @Inject() private authService: AuthService;
//   @Inject() private secureService: SecureService;
  
  constructor() { }

  @Put('/:id/update')
  async updateUser(@Param('id') id: string , @Body() user: IUser) {
    console.log('/////////////////////////////////// CONTROLLER ////////////////////////////////////////');
    console.log(id);
    console.log(user);
    debug('POST /user/update => Successfully updated!');
    return 'wouuuuu';
  }
 
}
