import mongoose from "mongoose";

export interface IParkingData {
    spotId: string;
    position: number[];
    status: string;
}
export interface IParkingModel {
    id: string;
    parkingData: IParkingData[];
}

const parkingSchema = new mongoose.Schema({
    id: {type: String, required: true},
    parkingData: {type: Array, required: true}
});

const parkingModel = mongoose.model<IParkingModel>("Parking", parkingSchema);

export {parkingModel as Parking}
