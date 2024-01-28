export class FetchParkingQuery {
    constructor(public parkingID: string) {
        if (!parkingID) {
            throw new Error("ParkingID not provided");
        }
    }
}
