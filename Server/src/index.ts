import {parkingRouter} from "./api/routes/parking";

require('dotenv').config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app: express.Application = express();
const port: string = process.env.PORT as string || "8000";

mongoose.connect(process.env.DB_URL!).then(() => {
    console.log('Connected to db');
}).catch(err => {
    console.log('Unable to connect to db', err);
});

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

app.use("/api/parking", parkingRouter);

app.listen(port, (): void => {
    console.log("Server started at:", port);
});
