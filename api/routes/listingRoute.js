import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
} from "../controllers/listingController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Create a new listing
router.post("/create", verifyToken, createListing);

// Delete a listing by ID
router.delete("/delete/:id", verifyToken, deleteListing);

// Update a listing by ID
router.post("/update/:id", verifyToken, updateListing);

// Get a single listing by ID
router.get("/get/:id", getListing);

// Get all listings
router.get("/get", getListings);

export default router;
