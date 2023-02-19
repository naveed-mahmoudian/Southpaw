import User from "../../models/User.js";

export const addFight = async (req, res) => {
  try {
    let isMatch = false;
    const { id } = req.params;
    const { userId } = req.body;

    const searchUser = await User.findById(userId);
    const fightsArray = searchUser.fights;
    if (fightsArray.includes(id)) {
      isMatch = true;

      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          $addToSet: { matches: userId },
        },
        { new: true }
      );

      if (!updatedUser) return res.status(404).json({ msg: "No user found" });

      await User.findByIdAndUpdate(
        userId,
        { $pull: { fights: id }, $addToSet: { matches: id } },
        { new: true }
      );

      res.status(200).json({ updatedUser, isMatch });
    } else {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          $addToSet: { fights: userId },
        },
        { new: true }
      );

      if (!updatedUser) return res.status(404).json({ msg: "No user found" });

      res.status(200).json({ updatedUser, isMatch });
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const addPass = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $addToSet: { passes: userId },
      },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ msg: "No user found" });

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const removeMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const updatedCurrentUser = await User.findByIdAndUpdate(
      id,
      { $pull: { matches: userId } },
      { new: true }
    );

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { matches: id } },
      { new: true }
    );

    res.status(201).json(updatedCurrentUser);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
