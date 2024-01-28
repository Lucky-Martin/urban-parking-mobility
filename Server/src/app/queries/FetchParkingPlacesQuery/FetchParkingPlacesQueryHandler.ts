import {IQueryHandler} from "../../types";
import {FetchParkingPlacesQuery} from "./FetchParkingPlacesQuery";
import {FetchParkingPlacesQueryReply} from "./FetchParkingPlacesQueryReply";
import {ParkingRepository} from "../../../db/repositories/ParkingRepository";

export class FetchParkingPlacesQueryHandler implements IQueryHandler<FetchParkingPlacesQuery, FetchParkingPlacesQueryReply> {
    async handle(query: FetchParkingPlacesQuery): Promise<FetchParkingPlacesQueryReply> {
        return {
            parkingPlaces: await ParkingRepository.fetchParkingPlaces()
        };
    }

}
