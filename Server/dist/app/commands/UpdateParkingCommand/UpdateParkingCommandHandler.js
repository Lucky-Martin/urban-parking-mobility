"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateParkingCommandHandler = void 0;
const ParkingRepository_1 = require("../../../db/repositories/ParkingRepository");
class UpdateParkingCommandHandler {
    handle(command) {
        return __awaiter(this, void 0, void 0, function* () {
            let parking = yield ParkingRepository_1.ParkingRepository.fetchParking(command.parkingID);
            if (parking) {
                parking.parkingData = command.parkingData;
                parking.markModified('parkingData');
                yield parking.save();
            }
            else {
                parking = yield ParkingRepository_1.ParkingRepository.createParking(command.parkingID, command.parkingData);
            }
            return { parking };
        });
    }
}
exports.UpdateParkingCommandHandler = UpdateParkingCommandHandler;
