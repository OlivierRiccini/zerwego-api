const debug = require('debug')('service');
import { Service, Inject } from "typedi";
import { TripDAO, ITrip, IWaitingUser, ParticipationStatus, IParticipant } from '../models/trip-model';
import { IUser, UserDAO } from "../models/user-model";
import _ = require("lodash");
import { HttpError } from "routing-controllers";

@Service()
export class TripService {
    @Inject() private tripDAO: TripDAO;
    @Inject() private userDAO: UserDAO;

    constructor() { }
    
    public async findTrips(userId: string): Promise<ITrip[]> {
        return this.tripDAO.find({
            find: {
                'participants.userId': userId
            }
        });
    }

    public findById(id: string) {
        return this.tripDAO.get(id);
    }

    public async createTrip(trip: ITrip) {
        try {
            // Check if user exists, if not send email or facebook notif or whatsapp notif or text notif
            await this.handleUsers(trip);
            return await this.tripDAO.create(trip);
        } catch (err) {
            console.log(err);
        }
    }

    public updateTrip(trip: ITrip, id: string) {          
        return this.tripDAO.update(trip, id);
    }

    public deleteTrip(id: string) {          
        return this.tripDAO.delete(id);
    }

    public handleTripRequest(requestResponse: ParticipationStatus, participant: IParticipant) {
        // if (requestResponse === 'accepted') {

        // }
        return;
    }

    private async handleUsers(trip: ITrip): Promise<void> {
        const emails: string[] = trip.participants.map(obj => { return obj.info.email });
        
        const registeredUsers: any[] = await this.userDAO.find({find: {'email': { $in: emails }}});
        const unRegisteredUsers: any [] = _.differenceWith(trip.participants, registeredUsers, _.isEqual);
        
        for (const participant of trip.participants) {
            const registeredUser: IUser = registeredUsers.find(user => user.email === participant.info.email);
            if (participant.isAdmin && registeredUser) {
                participant.userId = registeredUser.id;
                participant.status = 'pending';
                await this.sendConfirmation();
            } else if (registeredUser) {
                participant.userId =  registeredUser.id;
                participant.status = 'pending';
                await this.sendTripRequest('pending');
            } else if (!registeredUser) {
                participant.status = 'not_registered';
                await this.sendTripRequest('not_registered');
            } else {
                throw new HttpError(400, 'Something went wring while handling partipants');
            }
        }
    }

    private async sendTripRequest(participantStatus: ParticipationStatus) {
        // /request/:tripId/:participantStatus => front 
        // endpoint => answerRequest /trips/request body: accepted or rejected
        return;
    }

    private async sendConfirmation() {
        return;
    }

}