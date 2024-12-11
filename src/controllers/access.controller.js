'use strict';

import AccessService from "../services/access.service.js";

class AccessContrller {
    signup =  async (req, res, next) => {
        try {
            return res.status(201).json(await AccessService.signup(req.body))
        } catch (error) {
            
        }
    }
}

export default new AccessContrller();