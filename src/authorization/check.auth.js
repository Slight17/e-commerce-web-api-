
import apiKeyService from "../services/apiKey.service.js";
import apiKeyModel from "../models/apiKey.model.js";
const HEADER =  {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
}

const apiKey = async (req, res, next) => {
    try {
        
        const key = req.headers[HEADER.API_KEY]?.toString()
        if (!key) {
            return res.status(401).json({ message: 'Unauthorized: API key is required' })
        }
        //check obj key

        const objKey = await apiKeyService.findById(key)

        if(!objKey) {
            return res.status(403).json(
                { message: 'Unauthorized: Invalid API key' }
            )
        }

        req.objKey = objKey
        return next()
        
    } catch (error) {
        
    }
}

const checkPermission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permission){
            return res.status(403).json(
                { message: 'Unauthorized: Permission denied' }
            )
        }
        const validPermissio = req.objKey.permission.includes(permission)
        if (!validPermissio){
            return res.status(403).json(
                { message: 'Unauthorized: Permission denied' }
            )
        }
        next()
    }
    
    
}

export default {apiKey, checkPermission};