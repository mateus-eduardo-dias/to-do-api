import jwt from "jsonwebtoken"
import config from "../configs/env.js"
import userSvc from "../services/userSvc.js"
import argon from "argon2"

export default {
    async verifyEntry(body) {
        if (body == undefined) {
            return {'info':'BodyNotFound', 'code':400}
        } else if (body.username == undefined || body.password == undefined){
            return {'info':'BodyNotFound', 'code':400}
        }
        const search = await userSvc.findUserByName(body.username);
        if (search.rowCount == 0){
            return {'info':'UserNotFound', 'code':404}
        } else {
            return {'info':'UserFound', 'code':409, 'search': search.rows}
        }
    },
    async genAuthToken(id, username){
        return jwt.sign({'id': id, 'username': username}, config.JWT_AUTH_KEY, {'issuer': config.JWT_ISS, 'expiresIn': '7d'})
    },
    async verifyHash(password, hash){
        return await (argon.verify(hash, password))
    },
    async verifyAuthToken(aHeader) {
        if (aHeader == undefined){
            return {'status': 'error', 'info': 'AuthNotFound', 'code':400};
        }
        const auth = aHeader.split(' ');
        if (auth[0] != 'Bearer' || auth.length != 2){
            return {'status': 'error', 'info': 'AuthError', 'code':400};
        }
        try{
            const payload = jwt.verify(auth[1], config.JWT_AUTH_KEY, {'issuer': config.JWT_ISS})
            if (payload.id && payload.username){
                const userSrch = await userSvc.findUserById(payload.id);
                if (userSrch.rows[0].username == payload.username){
                    return {'status': 'success', 'info': {'db': userSrch[0], 'id': payload.id, 'username': payload.username}}
                } else{
                    return {'status': 'error', 'info': 'UserNotFound', 'code': 400}
                }
            } else{
                return {'status': 'error', 'info': 'AuthError', 'code':400};
            }
        } catch (err) {
            switch (err.name) {
                case 'TokenExpiredError':
                    return {'status': 'error', 'info': 'AuthExpired', 'code': 401};
                default:
                    console.log(err)
                    return {'status': 'error', 'info': 'AuthError', 'code': 500};
            }
        }
    }
}