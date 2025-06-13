import jwt from "jsonwebtoken"
import config from "../configs/env.js"
import userSvc from "../services/userSvc.js"
import argon from "argon2"

export default {
    async verifyEntry(body) {
        if (body.username == undefined || body.password == undefined){
            return {'info':'AuthNotFound', 'code':400}
        }
        const search = await userSvc.findUserByName(body.username);
        if (search.rowCount == 0){
            return {'info':'UserNotFound', 'code':404}
        } else {
            return {'info':'UserFound', 'code':409, 'search': search.rows[0]}
        }
    },
    async genAuthToken(id, username){
        return jwt.sign({'id': id, 'username': username}, config.JWT_AUTH_KEY, {'issuer': config.JWT_ISS, 'expiresIn': '7d'})
    },
    async verifyPassword(password, hash){
        return await (argon.verify(hash, password))
    },
    async verifyAuthToken(req, res, next) {
        const aHeader = req.headers.authorization;
        if (aHeader == undefined){
            next({'status': 'error', 'info': 'AuthNotFound'});
        }
        const auth = aHeader.split(' ');
        if (auth[0] != 'Bearer' || auth.length != 2){
            next({'status': 'error', 'info': 'AuthError'});
        }
        try{
            const payload = jwt.verify(auth[1], config.JWT_KEY, {'issuer': config.JWT_ISS})
            if (payload.userId && payload.username){
                const userSrch = await userSvc.findUserById(payload.userId);
                if (userSrch[0].username == payload.username){
                    next({'status': 'success', 'info': {'db': userSrch[0], 'userId': payload.userId, 'username': payload.username}})
                } else{
                    next({'status': 'error', 'info': 'UserNotFound'})
                }
            } else{
                next({'status': 'error', 'info': 'AuthError'});
            }
        } catch (err) {
            switch (err.name) {
                case 'TokenExpiredError':
                    next({'status': 'error', 'info': 'AuthExpired'});
                    break;
                default:
                    next({'status': 'error', 'info': 'AuthError'});
                    break;
            }
        }
    }
}