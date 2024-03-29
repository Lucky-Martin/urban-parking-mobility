"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateParkingCommand = void 0;
class UpdateParkingCommand {
    constructor(parkingID, parkingData) {
        this.parkingID = parkingID;
        this.parkingData = parkingData;
        console.log(parkingID, parkingData, !parkingData);
        if (!parkingID || parkingID === '') {
            throw new Error("ParkingID not provided");
        }
        if (!parkingData) {
            throw new Error("Parking data not provided");
        }
    }
}
exports.UpdateParkingCommand = UpdateParkingCommand;
