'use strict';

import jwt from 'jsonwebtoken';

const createTokenPair =  async (payload, publicKey, privateKey) =>{

    try {
        //access token 
        const accessToken =  await jwt.sign(payload, publicKey, {
            expiresIn: '2 Days'
        })
        const refreshToken =  await jwt.sign(payload, privateKey, {
            expiresIn: '7 Days'
        })

        jwt.verify( accessToken, publicKey, (err, decode) =>{
            if(err){
                console.error(err);
            }else{
                console.log(`decoded: `, decode);         
            }
        })

        return { accessToken, refreshToken};
        


    } catch (error) {
        return error
    }

}

//exporting function  to be used in other files
export default createTokenPair;