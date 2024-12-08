'use strict';

import mongoose from "mongoose";
import os from 'os';
import process from "process";
const _SECONDS = 5000;

// count connections
const countConnections =   () => {
    const numberOfCon = mongoose.connections.length;
    console.log(`Connected to ${numberOfCon} MongoDB instances`);
}

// check overload
const checkOverload = () => {
    setInterval(() => {
        const numCon = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = os.memoryUsage().rss;
        //example maximum number of connections based on number of cores
        const maxConnections = numCores * 5

        console.log(`Active connections: ${maxConnections}`);
        console.log(`Memory usage: ${memoryUsage /1024 /1024} MB`) 

        
        if (numCon >= maxConnections) {
            console.error('Overload warning: Reached maximum connections');
        }



    }, _SECONDS)
}