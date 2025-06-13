import authUtil from "../util/authUtil.js"
import userSvc from "../services/userSvc.js"

export default {
    async register(req, res, next){
        const status = await authUtil.verifyEntry(req.body);
        if (status.info != 'UserNotFound'){
            next({'status': 'error', 'r': {'id': status.info}, 'code':status.code})
        } else {
            const operation = await userSvc.createUser(req.body.username, req.body.password)
            authUtil.genAuthToken(operation.rows[0].id, operation.rows[0].username)
            .then((val) => {
                next({'status': 'success', 'r': {'token': val}, 'code': 201})
            })
            .catch((err) => {
                console.log(err)
                next({'status': 'error', 'r': {'id': 'TokenGenerationError'}, 'code': 500})
            })
            
        }
    },
    async login(req, res, next){
        const status = await authUtil.verifyEntry(req.body);
        if (status.info != 'UserFound'){
            next({'status': 'error', 'r': {'id': status.info}, 'code':status.code})
        } else {
            if (authUtil.verifyPassword(req.body.password, status.search.password)){
                authUtil.genAuthToken(status.search.id, status.search.username)
                .then((val) => {
                    next({'status': 'success', 'r': {'token': val}, 'code': 201})
                })
                .catch((err) => {
                    console.log(err)
                    next({'status': 'error', 'r': {'id': 'TokenGenerationError'}, 'code': 500})
                })
            } else {
                next({'status': 'error', 'r': {'id': 'PasswordInvalid'}, 'code': 401})
            }
        }
    }
}