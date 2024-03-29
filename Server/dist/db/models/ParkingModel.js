"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parking = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const parkingSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    parkingData: { type: Array, required: true }
});
const parkingModel = mongoose_1.default.model("Parking", parkingSchema);
exports.Parking = parkingModel;
