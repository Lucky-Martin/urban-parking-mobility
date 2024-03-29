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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parkingRouter = void 0;
const express_1 = __importDefault(require("express"));
const FetchParkingPlacesQueryHandler_1 = require("../../app/queries/FetchParkingPlacesQuery/FetchParkingPlacesQueryHandler");
const UpdateParkingCommandHandler_1 = require("../../app/commands/UpdateParkingCommand/UpdateParkingCommandHandler");
const UpdateParkingCommand_1 = require("../../app/commands/UpdateParkingCommand/UpdateParkingCommand");
const FetchParkingPlacesQuery_1 = require("../../app/queries/FetchParkingPlacesQuery/FetchParkingPlacesQuery");
const FetchParkingQuery_1 = require("../../app/queries/FetchParkingQuery/FetchParkingQuery");
const FetchParkingQueryHandler_1 = require("../../app/queries/FetchParkingQuery/FetchParkingQueryHandler");
const router = express_1.default.Router();
exports.parkingRouter = router;
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryHandler = new FetchParkingPlacesQueryHandler_1.FetchParkingPlacesQueryHandler();
        const query = new FetchParkingPlacesQuery_1.FetchParkingPlacesQuery();
        res.status(200).json(yield queryHandler.handle(query));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
}));
router.get("/:parkingID", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryHandler = new FetchParkingQueryHandler_1.FetchParkingQueryHandler();
        const query = new FetchParkingQuery_1.FetchParkingQuery(req.params.parkingID);
        res.status(200).json(yield queryHandler.handle(query));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
}));
router.patch("/:parkingID", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commandHandler = new UpdateParkingCommandHandler_1.UpdateParkingCommandHandler();
        const command = new UpdateParkingCommand_1.UpdateParkingCommand(req.params.parkingID, req.body.parkingData);
        res.status(200).json(yield commandHandler.handle(command));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
}));
