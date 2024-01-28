import {ICommandHandler} from "../../types";
import {UpdateParkingCommand} from "./UpdateParkingCommand";
import {UpdateParkingCommandReply} from "./UpdateParkingCommandReply";
import {ParkingRepository} from "../../../db/repositories/ParkingRepository";

export class UpdateParkingCommandHandler implements ICommandHandler<UpdateParkingCommand, UpdateParkingCommandReply>{
    async handle(command: UpdateParkingCommand): Promise<UpdateParkingCommandReply> {
        let parking = await ParkingRepository.fetchParking(command.parkingID);

        if (parking) {
            parking.parkingData = command.parkingData;
            parking.markModified('parkingData');
            await parking.save();
        } else {
            parking = await ParkingRepository.createParking(command.parkingID, command.parkingData);
        }

        return {parking}
    }
}
