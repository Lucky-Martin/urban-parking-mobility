import {IQueryHandler} from "../../types";
import {FetchParkingQuery} from "./FetchParkingQuery";
import {FetchParkingQueryReply} from "./FetchParkingQueryReply";
import {ParkingRepository} from "../../../db/repositories/ParkingRepository";

export class FetchParkingQueryHandler implements IQueryHandler<FetchParkingQuery, FetchParkingQueryReply> {
    async handle(query: FetchParkingQuery): Promise<FetchParkingQueryReply> {
        const parking = await ParkingRepository.fetchParking(query.parkingID);

        if (!parking) {
            throw new Error("Parking not found!");
        }

        return {
            id: parking.id,
            parkingData: parking.parkingData
        };
    }

}
