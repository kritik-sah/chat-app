import User from "../models/user.models.js";

export const getUsers = async (req, res) => {
  try {
    const logedInUser = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: logedInUser } }).select(
      "-password"
    );
    res.status(200).json(filteredUsers);
  } catch (error) {
    res.status(500).json({ error, message: "error while getting users" });
  }
};
