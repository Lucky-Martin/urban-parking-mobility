"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchParkingQuery = void 0;
class FetchParkingQuery {
    constructor(parkingID) {
        this.parkingID = parkingID;
        if (!parkingID) {
            throw new Error("ParkingID not provided");
        }
    }
}
exports.FetchParkingQuery = FetchParkingQuery;
