'use strict';

import AccessService from "../services/access.service.js";

class AccessContrller {
    signup =  async (req, res, next) => {
        try {
            console.log(`[P]::Signup:: `, req.body)
            return res.status(201).json(await AccessService.signup(req.body))
        } catch (error) {
            
        }
    }
}

export default new AccessContrller();