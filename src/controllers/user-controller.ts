const debug = require('debug')('http');
import {JsonController, Body, Put, Param} from "routing-controllers";
import { IUser } from "../models/user-model";
import { Service, Inject } from "typedi";
import { UserService } from "../services/user-service";
// import { AuthService } from "../services/auth-service";
// import { SecureService } from "../services/secure-service";

@JsonController('/users')
@Service()
export class UserController {
  @Inject() private userService: UserService;
//   @Inject() private authService: AuthService;
//   @Inject() private secureService: SecureService;
  
  constructor() { }

  @Put('/:id/update')
  async updateUser(@Param('id') id: string , @Body() user: IUser) {
    const updatedUser: IUser = await this.userService.updateUser(user, id);
    debug('POST /user/update => Successfully updated!');
    return updatedUser;
  }
 
}
