import express from "express";
import {
  deleteUser,
  updateUser,
  getUserListings,
  getUser,
  getAllUser,
} from "../controllers/userController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Get All Users
router.get("/get", getAllUser);
//Update user details
router.put("/update/:id", verifyToken, updateUser);

//Delete user account
router.delete("/delete/:id", verifyToken, deleteUser);

//Get all listings created by a specific user
router.get("/listings/:id", verifyToken, getUserListings);

//Get user details by ID
router.get("/:id", verifyToken, getUser);

export default router;
