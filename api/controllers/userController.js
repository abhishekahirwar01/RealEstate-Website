import bcryptjs from "bcryptjs";
import User from "../models/userModel.js";
import Listing from "../models/listingModel.js";
import { errorHandler } from "../utils/error.js";

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }); // Sort by createdAt in descending order
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recent users", error });
  }
};

// Update User
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!"));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators:true}
    );

    if (!updatedUser) return next(errorHandler(404, "User not found!"));

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

//Delete User
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account!"));
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return next(errorHandler(404, "User not found!"));

    res.clearCookie("access_token");
    res.status(200).json({ success: true, message: "User has been deleted!" });
  } catch (error) {
    next(error);
  }
};

// Get User Listings
export const getUserListings = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only view your own listings!"));

  try {
    const listings = await Listing.find({ userRef: req.params.id });

    res.status(200).json({
      success: true,
      listings,
    });
  } catch (error) {
    next(error);
  }
};

//Get User Details
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) return next(errorHandler(404, "User not found!"));

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
