import config from "config";
import TelegramBot from "node-telegram-bot-api";
import mongoose from 'mongoose';
import {App} from "./App";

mongoose.connect(config.get("mongoURL"))
    .then(() =>
    {
        console.log(`connected`);
        const app = new App(new TelegramBot(config.get("token"), {polling: true}));
    })
    .catch((err) => console.log(`Mongo connection err: ${err}`));

