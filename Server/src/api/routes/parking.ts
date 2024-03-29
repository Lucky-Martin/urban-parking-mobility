import express from "express";
import cron from "node-cron";
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

setInterval(async () => {
    let randomNumber = Math.floor(Math.random() * 4) + 1;
    const parkingId = "id1";
    let initialSpots = 0;

    const queryHandler = new FetchParkingQueryHandler();
    const query = new FetchParkingQuery(parkingId);
    const res = await queryHandler.handle(query);

    let availableSpotsObj = res.parkingData.filter(parkingSpace => {
        return parkingSpace.status === 'available';
    });
    initialSpots = availableSpotsObj.length;
    let newAvailableSpotsCount = availableSpotsObj.length + randomNumber;
    if (newAvailableSpotsCount >= res.parkingData.length) {
        newAvailableSpotsCount -= randomNumber;
    }
    let currentAvailable = res.parkingData.filter(spot => spot.status === 'available').length;
    let spotsToChange = newAvailableSpotsCount - currentAvailable;

    res.parkingData.forEach(spot => {
        if (spotsToChange > 0 && spot.status === 'taken') {
            spot.status = 'available';
            spotsToChange--;
        }
    });
    console.log(res.parkingData);
    const commandHandler = new UpdateParkingCommandHandler();
    const command = new UpdateParkingCommand("id1", res.parkingData);
    await commandHandler.handle(command);

    console.log('prev:', initialSpots, 'current:', newAvailableSpotsCount)
}, 5000)

// cron.schedule('* * * * *', async () => {
//     const now = new Date();
//     if (now.getSeconds() >= 30) {
//         let randomNumber = Math.floor(Math.random() * 3) + 1;
//         const parkingId = "id1";
//         let initialSpots = 0;
//
//         const queryHandler = new FetchParkingQueryHandler();
//         const query = new FetchParkingQuery(parkingId);
//         const res = await queryHandler.handle(query);
//
//         let availableSpots = res.parkingData.filter(parkingSpace => {
//             return parkingSpace.status === 'available';
//         });
//         initialSpots = availableSpots.length;
//         let newAvailableSpotsCount = availableSpots.length + randomNumber;
//         if (newAvailableSpotsCount >= res.parkingData.length) {
//             newAvailableSpotsCount -= randomNumber;
//         }
//         console.log('prev:', initialSpots, 'current:', newAvailableSpotsCount)
//     }
// });

export {router as parkingRouter};
