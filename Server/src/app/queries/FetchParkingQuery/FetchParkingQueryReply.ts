import {IParkingData} from "../../../db/models/ParkingModel";

export class FetchParkingQueryReply {
    id!: string;
    parkingData!: IParkingData[];
}
