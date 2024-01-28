import {IParkingData, Parking} from "../models/ParkingModel";
import {v4 as uuid} from "uuid";

export class ParkingRepository {
    public static async fetchParkingPlaces() {
        return await Parking.find({});
    }

    public static async fetchParking(parkingID: string) {
        return await Parking.findOne({id: parkingID});
    }

    public static async createParking(parkingID: string, parkingData: IParkingData[]) {
        const parking = new Parking({
            id: parkingID,
            uuid: uuid(),
            parkingData
        });

        await parking.save();
        return parking;
    }
}
