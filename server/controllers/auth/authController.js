import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";

export const signup = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastInitial,
      location,
      height,
      weight,
      DOB,
      picturePath,
      nickname,
      bio,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastInitial,
      location,
      height,
      weight,
      DOB,
      picturePath,
      nickname,
      bio,
    });

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email }).exec();

    if (!user) return res.status(400).json({ msg: "User does not exist." });

    const isCorrectPw = await bcrypt.compare(password, user.password);

    if (!isCorrectPw)
      return res.status(400).json({ msg: "Invalid credentials." });

    if (user.isDeactivated)
      return res
        .status(400)
        .json({ msg: "Your account is deactivated", isDeactivated: true });
    if (user.isBanned)
      return res
        .status(400)
        .json({ msg: "Your account has been banned", isBanned: true });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    user.password = undefined;

    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
