import authUtil from "../util/authUtil.js"
import userSvc from "../services/userSvc.js"

export default {
    async mkTask(req, res, next){
        if (req.body == undefined){
            next({'status': 'error', 'r': {'id': 'BodyNotFound'}, 'code':400})
        } else if (req.body.name == undefined){
            next({'status': 'error', 'r': {'id': 'BodyNotFound'}, 'code':400})
        } else {
            const verify = await authUtil.verifyAuthToken(req.headers.authorization)
            if (verify.status == 'error'){
                next({'status': 'error', 'r': {'id': verify.info}, 'code': verify.code})
            } else {
                if (req.body.description == undefined){
                    req.body.description = null
                }
                await userSvc.createTask(verify.info.id, req.body.name, req.body.description);
                next({'status': 'success', 'code':201})
            }
        }
    },
    async upTask(req, res, next){
        if (req.body == undefined){
            next({'status': 'error', 'r': {'id': 'BodyNotFound'}, 'code':400})
        } else if (req.body.id == undefined || req.body.field == undefined || req.body.new_value == undefined){
            next({'status': 'error', 'r': {'id': 'BodyNotFound'}, 'code':400})
        } else {
            const verify = await authUtil.verifyAuthToken(req.headers.authorization)
            if (verify.status == 'error'){
                next({'status': 'error', 'r': {'id': verify.info}, 'code': verify.code})
            } else {
                const verifyB = await userSvc.findTaskById(req.body.id);
                if (verifyB.rowCount == 0){
                    next({'status': 'error', 'r': {'id': 'TaskNotFound'}, 'code': 404});
                } else {
                    if (verify.info.id == verifyB.rows[0].user_id){
                        switch (req.body.field){
                            case 'name':
                                await userSvc.updateTaskName(req.body.id, req.body.new_value);
                                next({'status': 'success', 'code':201});
                                break;
                            case 'description':
                                await userSvc.updateTaskDescription(req.body.id, req.body.new_value);
                                next({'status': 'success', 'code':201});
                                break;
                            case 'status':
                                if (req.body.new_value >= 0 && req.body.new_value <= 3){
                                    await userSvc.updateTaskStatus(req.body.id, req.body.new_value);
                                    next({'status': 'success', 'code':201});
                                } else {
                                    next({'status': 'error', 'r': {'id': 'OperationInvalid'}, 'code': 400});
                                }
                                break;
                            default:
                                next({'status': 'error', 'r': {'id': 'OperationInvalid'}, 'code': 400});
                                break;
                        }
                    } else {
                        next({'status': 'error', 'r': {'id': 'NotAllowed'}, 'code': 401});
                    }
                }
            }
        }
    },
    async getTask(req, res, next){
        const verify = await authUtil.verifyAuthToken(req.headers.authorization)
        if (verify.status == 'error'){
            next({'status': 'error', 'r': {'id': verify.info}, 'code': verify.code})
        } else {
            const tasks = await userSvc.getTasksByUserId(verify.info.id);
            if (tasks.rowCount == 0){
                next({'status': 'success', 'r': {'tasks': tasks.rows}, 'code': 204})
            } else {
                for (let i = 0; i < tasks.rowCount; i++){
                    tasks.rows[i].user_id = undefined;
                }
                next({'status': 'success', 'r': {'tasks': tasks.rows}, 'code': 200})
            }
        }
    },
    async rmTask(req, res, next){
        if (req.body == undefined){
            next({'status': 'error', 'r': {'id': 'BodyNotFound'}, 'code':400})
        } else if (req.body.id == undefined){
            next({'status': 'error', 'r': {'id': 'BodyNotFound'}, 'code':400})
        } else {
            const verify = await authUtil.verifyAuthToken(req.headers.authorization)
            if (verify.status == 'error'){
                next({'status': 'error', 'r': {'id': verify.info}, 'code': verify.code})
            } else {
                const verifyB = await userSvc.findTaskById(req.body.id);
                if (verifyB.rowCount == 0){
                    next({'status': 'error', 'r': {'id': 'TaskNotFound'}, 'code': 404});
                } else {
                    if (verify.info.id == verifyB.rows[0].user_id){
                        await userSvc.deleteTaskById(req.body.id);
                        next({'status': 'success', 'code':200})
                    } else {
                        next({'status': 'error', 'r': {'id': 'NotAllowed'}, 'code': 401});
                    }
                }
            }
        }
    }
}