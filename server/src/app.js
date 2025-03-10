'use strict';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
const app = express();
import routes from './routes/index.js';
import StatusCode from 'http-status-codes'
import { errorHandlerMiddleware, errorMiddleware } from './middlewares/errorHandlingMiddleware.js'


//inti middleware
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


//init database
import './dbs/init.mongoose.js'
//init routes   
app.use('/', routes);


//handling  errors  
app.use(errorHandlerMiddleware)
app.use(errorMiddleware)


export default app;