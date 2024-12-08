'use strict';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
const app = express();

//inti middleware
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())


//init database
import  './dbs/init.mongoose.js'
//init routes   

//handling  errors  

export default app;