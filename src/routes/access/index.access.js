'use strict';

import express from 'express';
import accessController from '../../controllers/access.controller.js';

const routes = express.Router();

//signUp routes

routes.post('/shop/signup', accessController.signup);

export default routes