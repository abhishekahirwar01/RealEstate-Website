import Listing from "../models/listingModel.js";
import { errorHandler } from "../utils/error.js";
// ✅ Create a new listing
export const createListing = async (req, res, next) => {
  try {
    const newListing = new Listing({ ...req.body, userRef: req.user.id });
    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (error) {
    next(errorHandler(500, "Error creating listing"));
  }
};

// ✅ Delete a listing by ID
export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "Listing not found!"));

    if (req.user.id !== listing.userRef.toString()) {
      return next(errorHandler(403, "You can only delete your own listings!"));
    }

    await listing.deleteOne();
    res.status(200).json({ message: "Listing has been deleted!" });
  } catch (error) {
    next(errorHandler(500, "Error deleting listing"));
  }
};

// ✅ Update a listing by ID
export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "Listing not found!"));

    if (req.user.id !== listing.userRef.toString()) {
      return next(errorHandler(403, "You can only update your own listings!"));
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(errorHandler(500, "Error updating listing"));
  }
};

// ✅ Get a single listing by ID
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "Listing not found!"));

    res.status(200).json(listing);
  } catch (error) {
    next(errorHandler(500, "Error fetching listing"));
  }
};

// ✅ Get all listings with filters, pagination, and sorting
export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    const filters = {
      name: { $regex: searchTerm, $options: "i" },
      offer: req.query.offer === "true" ? true : { $in: [true, false] },
      furnished: req.query.furnished === "true" ? true : { $in: [true, false] },
      parking: req.query.parking === "true" ? true : { $in: [true, false] },
      type:
        req.query.type && req.query.type !== "all"
          ? req.query.type
          : { $in: ["sale", "rent"] },
    };

    const listings = await Listing.find(filters)
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    res.status(200).json(listings);
  } catch (error) {
    next(errorHandler(500, "Error fetching listings"));
  }
};
