import {JsonController, Param, Body, Get, Post, Put, Delete, Req, Res} from "routing-controllers";
import { TripService } from "../services/trip-Service";
import { ITrip } from "../models/trip-model";

@JsonController('/trips')
export class TripController {
  constructor(private tripService: TripService) {    
    this.tripService = new TripService();
  }
  
 
  @Get()
  async getAll() { 
    let trips = await this.tripService.fetchAll();
    //  console.log(trips);
     return trips;
  }

  @Post()
    async addTrip(@Body() trip: ITrip, @Req() request): Promise<any> {
    return this.tripService.createTrip(request.body);
  }

  @Delete('/:id')
    async deleteTrip(@Param('id') id: string): Promise<any> {
      // console.log(id);
    return this.tripService.deleteTrip(id);
  }
 
}