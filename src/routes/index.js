import express from 'express';
import accessRoute from './access/index.access.js'
import check from '../authorization/check.auth.js';
import productRoute from './products/index.products.js'
import { asyncHandler } from '../utils/asyncHandle.js';
import discountRoute from './discount/index.discount.js'

const routes = express.Router();



//check apiKey
routes.use(asyncHandler(check.apiKey));
//check permissions
routes.use(asyncHandler(check.checkPermission('0000')))
// routes.get('/', (req, res) => {
//     res.status(200).json({ message: 'API is working' });
// });


routes.use('/v1/api/discount', discountRoute)
routes.use('/v1/api/product', productRoute)
routes.use('/v1/api', accessRoute)

export default routes;