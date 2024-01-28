import express from "express";
import {FetchParkingPlacesQueryHandler} from "../../app/queries/FetchParkingPlacesQuery/FetchParkingPlacesQueryHandler";

import {UpdateParkingCommandHandler} from "../../app/commands/UpdateParkingCommand/UpdateParkingCommandHandler";
import {UpdateParkingCommand} from "../../app/commands/UpdateParkingCommand/UpdateParkingCommand";
import {FetchParkingPlacesQuery} from "../../app/queries/FetchParkingPlacesQuery/FetchParkingPlacesQuery";
import {FetchParkingQuery} from "../../app/queries/FetchParkingQuery/FetchParkingQuery";
import {FetchParkingQueryHandler} from "../../app/queries/FetchParkingQuery/FetchParkingQueryHandler";

const router: express.Router = express.Router();

router.get("/", async (req: express.Request, res: express.Response) => {
    try {
        const queryHandler = new FetchParkingPlacesQueryHandler();
        const query = new FetchParkingPlacesQuery();
        res.status(200).json(await queryHandler.handle(query));
    } catch (e: any) {
        res.status(500).json({error: e.message});
    }
});

router.get("/:parkingID", async (req: express.Request, res: express.Response) => {
    try {
        const queryHandler = new FetchParkingQueryHandler();
        const query = new FetchParkingQuery(req.params.parkingID);
        res.status(200).json(await queryHandler.handle(query));
    } catch (e: any) {
        res.status(500).json({error: e.message});
    }
});

router.patch("/:parkingID", async (req: express.Request, res: express.Response) => {
    try {
        const commandHandler = new UpdateParkingCommandHandler();
        const command = new UpdateParkingCommand(req.params.parkingID, req.body.parkingData);
        res.status(200).json(await commandHandler.handle(command))
    } catch (e: any) {
        res.status(500).json({error: e.message});
    }
});

export {router as parkingRouter};
