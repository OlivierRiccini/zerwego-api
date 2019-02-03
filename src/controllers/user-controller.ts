const debug = require('debug')('http');
import {JsonController, Param, Body, Get, Post, Put, Delete, Req, Res, Header, HeaderParam, ResponseClassTransformOptions} from "routing-controllers";
import { IUser } from "../models/user-model";
import { Service } from "typedi";
import { UserDAO } from '../models/user-model';
import { UserService } from "../services/user-Service";

@JsonController('/users')
@Service()
export class UserController {

    constructor(private userService: UserService) {    
        this.userService = new UserService(new UserDAO());
      }
  
    @Post()
    async createUser(@Body() user: IUser, @Res() response: any) {
        const newUser = await this.userService.createUser(user);
        const token = newUser.tokens[0].token;
        response.header('x-auth', token);
        debug('POST /user => ' + JSON.stringify(newUser));
        return newUser;
  }

 
}