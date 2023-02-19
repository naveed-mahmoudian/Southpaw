import User from "../../models/User.js";

export const getUsers = async (req, res) => {
  try {
    const { id } = req.params;

    const users = await User.find();
    const currentUser = await User.findById(id);

    if (!users) return res.status(404).json({ msg: "No users found" });

    const filteredUsers = users.filter((user) => user._id != id);

    const currentUserFights = currentUser.fights;
    const currentUserPasses = currentUser.passes;
    const currentUserMatches = currentUser.matches;

    const noFightsPassesMatches = filteredUsers.filter((user) => {
      if (
        currentUserFights.includes(user._id) ||
        currentUserMatches.includes(user._id) ||
        currentUserPasses.includes(user._id)
      ) {
        return false;
      } else {
        return true;
      }
    });

    res.status(200).json(noFightsPassesMatches);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getMatches = async (req, res) => {
  try {
    const { id } = req.params;

    const userMatches = await User.findById(id).populate("matches");

    if (!userMatches) return res.status(404).json({ msg: "No user matches." });

    res.status(200).json(userMatches.matches);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) return res.status(404).json({ msg: "No user found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
