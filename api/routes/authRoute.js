import express from "express";
import {signOut, signUp, login} from "../controllers/authController.js"
const router = express.Router();

router.post("/signup", signUp)
router.post("/login", login)
router.post("/signout", signOut)

export default router; 