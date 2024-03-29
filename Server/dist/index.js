"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parking_1 = require("./api/routes/parking");
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT || "8000";
mongoose_1.default.connect('mongodb+srv://admin-user-main:h2dOzyl6QFFqYfFBUperAcLYWepvYy5A@karakondzul.7gdqy.mongodb.net/karakondzul?retryWrites=true&w=majority').then(() => {
    console.log('Connected to db');
}).catch(err => {
    console.log('Unable to connect to db', err);
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
app.use("/api/parking", parking_1.parkingRouter);
app.listen(port, () => {
    console.log("Server started at:", port);
});
