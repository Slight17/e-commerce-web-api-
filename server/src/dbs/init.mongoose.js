'use strict';
import 'dotenv/config'
import mongoose from "mongoose";

const connectString = process.env.URL_DATABASE

class Database {
    constructor() {
        this.connect();
    }

    async connect() {

        if (1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
        }
        try {
            await mongoose.connect(connectString).then(console.log("Connected to MongoDB"))

        } catch (error) {
            console.error("Error connecting to MongoDB", error);
        }
    }


    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }


}

const instanceMoogoDB = Database.getInstance()

export default { instanceMoogoDB };