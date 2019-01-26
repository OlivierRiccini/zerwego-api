const debug = require('debug')('http');
import {JsonController, Param, Body, Get, Post, Put, Delete, Req, Res} from "routing-controllers";
import { TripService } from "../services/trip-Service";
import { ITrip, TripDAO } from "../models/trip-model";
import { Service } from "typedi";

@JsonController('/trips')
@Service()
export class TripController {
  constructor(private tripService: TripService) {    
    this.tripService = new TripService(new TripDAO());
  }
  
 
  @Get()
  async getAllTrips() { 
    let trips = await this.tripService.fetchAll();
    debug('GET /trips => ' + JSON.stringify(trips));
    return trips;
  }

  @Get('/:id')
  async getTripById(@Param('id') id: string) { 
    debug('GET /trip by id');
    let trip = await this.tripService.findById(id);
    debug('GET /trip by id => ' + JSON.stringify(trip));
    return trip;
  }

  @Post()
    async addTrip(@Body() trip: ITrip, @Req() request) {
    const newTrip = await this.tripService.createTrip(trip);
    debug('POST /trip => ' + JSON.stringify(newTrip));
    return newTrip;
  }

  @Delete('/:id')
    async deleteTrip(@Param('id') id: string) {
    debug('DELETE /trip by id');
    const response = await this.tripService.deleteTrip(id);
    debug('DELETE /trip by id => ' + JSON.stringify(response));
    return response;
  }
 
}