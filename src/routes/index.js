import express from 'express';
import accessRoute from './access/index.access.js'
import check from '../authorization/check.auth.js';
import { asyncHandler } from '../utils/asyncHandle.js';
const routes = express.Router();

//check apiKey
routes.use(asyncHandler(check.apiKey));
//check permissions
routes.use(asyncHandler(check.checkPermission('0000')))
// routes.get('/', (req, res) => {
//     res.status(200).json({ message: 'API is working' });
// });

routes.use('/v1/api', accessRoute)

export default routes;