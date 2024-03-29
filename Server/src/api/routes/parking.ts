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

let minCount = 0;
let maxCount = 0;
let customMax = false;
let customMin = false;

router.get("/:parkingID/:spots", async (req: express.Request, res: express.Response) => {
    try {
        const spots = Number(req.params.spots);
        if (req.params.parkingID === "id1") {
            if (spots) {
                // console.log('change spots', spots)
                minCount = 0;
                maxCount = 0;
                customMax = false;
                customMin = false;
                await changeAvailSpots(spots);
                res.status(200).json({msg: `spots: ${spots}`})
            }
        }
    } catch (e: any) {
        res.status(500).json({error: e.message});
    }
});

router.get("/:parkingID/:spots/:max/:min", async (req: express.Request, res: express.Response) => {
    try {
        console.log(req.params)
        minCount = Number(req.params.min);
        maxCount = Number(req.params.max);
        const respond = {msg: `maxCount: ${maxCount}, minCount: ${minCount}`};
        customMax = true;
        customMin = true;
        await changeAvailSpots(Number(req.params.spots));
        res.status(200).json(respond);
    } catch (e: any) {
        res.status(500).json({error: e.message});
    }
});

const changeAvailSpots = async (amount?: number) => {
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
    if (!customMax) {
        maxCount = res.parkingData.length;
    }
    newAvailableSpotsCount = Math.max(newAvailableSpotsCount, minCount); // Prevent it from going below 0
    newAvailableSpotsCount = Math.min(newAvailableSpotsCount, maxCount); // Prevent it from exceeding total spots

    if (amount) {
        newAvailableSpotsCount = amount;
    }

    let spotsToChange = Math.abs(newAvailableSpotsCount - initialSpots); // Calculate spots to change
    let statusToChange = randomNumber > 0 ? 'taken' : 'available'; // Determine status to change based on randomNumber

    res.parkingData.forEach(spot => {
        if (spotsToChange > 0 && spot.status === statusToChange) {
            spot.status = statusToChange === 'taken' ? 'available' : 'taken';
            spotsToChange--;
        }
    });

    // console.log(res.parkingData);

    const commandHandler = new UpdateParkingCommandHandler();
    const command = new UpdateParkingCommand("id1", res.parkingData);
    await commandHandler.handle(command);

    console.log('prev:', initialSpots, 'current:', newAvailableSpotsCount);
}

setInterval(async () => {
    await changeAvailSpots();
}, 5000)

export {router as parkingRouter};

