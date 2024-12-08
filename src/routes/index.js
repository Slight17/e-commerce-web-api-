import express from 'express';
import accessRoute from './access/index.access.js'

const routes = express.Router();

// routes.get('/', (req, res) => {
//     res.status(200).json({ message: 'API is working' });
// });

routes.use('/v1/api', accessRoute)

export default routes;