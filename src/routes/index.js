import express from "express";
import authCtrl from "../controllers/authCtrl.js";
import taskCtrl from "../controllers/taskCtrl.js"
import rHandler from "../middleware/responseHandler.js"
const router = express.Router();

// auth
router.post('/auth', authCtrl.register) // register
router.get('/auth', authCtrl.login) // login

// tasks
router.post('/task', taskCtrl.mkTask) // new task
router.put('/task', taskCtrl.upTask) // update task
router.get('/task', taskCtrl.getTask) // get all tasks
router.delete('/task', taskCtrl.rmTask) // delete task

router.use(rHandler)

export default router;