import {IParkingData} from "../../../db/models/ParkingModel";

export class UpdateParkingCommand {
    constructor(public parkingID: string, public parkingData: IParkingData[]) {
        if (!parkingID || parkingID === '') {
            throw new Error("ParkingID not provided");
        }

        if (!parkingData) {
            throw new Error("Parking data not provided");
        }
    }
}
