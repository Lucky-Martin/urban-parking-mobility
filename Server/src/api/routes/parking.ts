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
    let randomNumber = Math.floor(Math.random() * 8) - 4; // Generates a number between -4 and 3
    if (randomNumber >= 0) {
        randomNumber += 1; // Adjusts the range to be between -4 and 4, excluding 0
    }

    const parkingId = "id1";

    const queryHandler = new FetchParkingQueryHandler();
    const query = new FetchParkingQuery(parkingId);
    const res = await queryHandler.handle(query);

    let availableSpotsObj = res.parkingData.filter(parkingSpace => parkingSpace.status === 'available');
    let initialSpots = availableSpotsObj.length;
    let newAvailableSpotsCount = initialSpots + randomNumber;

// Ensure newAvailableSpotsCount is within valid range
    newAvailableSpotsCount = Math.max(newAvailableSpotsCount, 0); // Prevent it from going below 0
    newAvailableSpotsCount = Math.min(newAvailableSpotsCount, res.parkingData.length); // Prevent it from exceeding total spots

    let spotsToChange = Math.abs(newAvailableSpotsCount - initialSpots); // Calculate spots to change
    let statusToChange = randomNumber > 0 ? 'taken' : 'available'; // Determine status to change based on randomNumber

    res.parkingData.forEach(spot => {
        if (spotsToChange > 0 && spot.status === statusToChange) {
            spot.status = statusToChange === 'taken' ? 'available' : 'taken';
            spotsToChange--;
        }
    });

    console.log(res.parkingData);

    const commandHandler = new UpdateParkingCommandHandler();
    const command = new UpdateParkingCommand("id1", res.parkingData);
    await commandHandler.handle(command);

    console.log('prev:', initialSpots, 'current:', newAvailableSpotsCount);
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
