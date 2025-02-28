import { Router } from "express";
import { protectRoute } from "../middelware/protectRoute.middelware.js";
import { getUser,getMsg,sendMsg } from "../controller/msg.controller.js";
const router = Router();

router.get("/users",protectRoute,getUser);

router.get("/message/:id",protectRoute,getMsg);

router.post("/sendMessage/:id",protectRoute,sendMsg);

export default router;