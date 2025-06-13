import express from "express";
import authCtrl from "../controllers/authCtrl.js";
import rHandler from "../middleware/responseHandler.js"
const router = express.Router();

// auth
router.post('/auth', authCtrl.register) // register
router.get('/auth', authCtrl.login) // login

// tasks
//router.post('/task') // new task
//router.get('/tasks') // get all tasks

router.use(rHandler)

export default router;