import bcrypt from "bcryptjs";
import User from "../models/user.models.js";
import generateTokenAndSetCookie from "../utils/grnerateJWT.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password, confirmPassword, gender } =
      req.body;

    if (password !== confirmPassword) {
      res.status(400).json({ error: "Passwords do not match" });
      return;
    }

    const user = await User.findOne({ username, email });
    if (user) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const profilePicture = `https://avatar.iran.liara.run/${
      gender !== "others"
        ? `public/${gender === "male" ? "boy" : "girl"}`
        : "username"
    }?username=${username}`;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
      gender,
      profilePicture,
    });

    await newUser.save();

    generateTokenAndSetCookie(newUser._id, res);

    const { password: userPassword, ...userDetails } = newUser._doc;
    res.status(201).json({
      error: null,
      message: "User created successfully",
      detail: userDetails,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userByUsername = await User.findOne({ username: username });
    const userByEmail = await User.findOne({ email: email });

    if (!userByUsername && !userByEmail) {
      res.status(400).json({ error: "User not found" });
      return;
    }
    if (userByUsername) {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        userByUsername?.password || ""
      );
      if (!isPasswordCorrect) {
        res.status(400).json({ error: "Invalid credentials" });
        return;
      }
      generateTokenAndSetCookie(userByUsername._id, res);
      const { password: userPassword, ...userDetails } = userByUsername._doc;
      res.status(201).json({
        error: null,
        message: "logged in successfully",
        detail: userDetails,
      });
    } else {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        userByEmail?.password || ""
      );
      if (!isPasswordCorrect) {
        res.status(400).json({ error: "Invalid credentials" });
        return;
      }
      generateTokenAndSetCookie(userByEmail._id, res);
      const { password: userPassword, ...userDetails } = userByEmail._doc;
      res.status(201).json({
        error: null,
        message: "logged in successfully",
        detail: userDetails,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ error: null, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error, message: "Unable to logout user!" });
  }
};
