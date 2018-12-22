import * as express from "express";
import * as trip from './controllers/trip-controller';
import * as bodyParser from 'body-parser';

// Our Express APP config
const app = express();
app.set("port", process.env.PORT || 3000);

// API Endpoints
// API Endpoints
app.use(bodyParser.json());

app.get('/', trip.allTrips)
app.get('/{id}', trip.getTrip)
app.post('/', trip.addTrip)
app.put('/{id}', trip.updateTrip)
app.delete('/{id}', trip.deleteTrip)

const server = app.listen(app.get("port"), () => {
  console.log("App is running on http://localhost:%d", app.get("port"))
});