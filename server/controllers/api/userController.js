import User from "../../models/User.js";
import ChatRoom from "../../models/ChatRoom.js";
import getChatRoomId from "../../utils/getChatRoomId.js";

export const getUsers = async (req, res) => {
  try {
    const { id } = req.params;

    const users = await User.find();
    const currentUser = await User.findById(id);

    if (!users) return res.status(404).json({ msg: "No users found" });

    const filteredUsers = users.filter((user) => {
      if (user._id.toString() === id || user.isDeactivated || user.isBanned) {
        return false;
      } else {
        return true;
      }
    });

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

    res.status(200).json(userMatches.matches.reverse());
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

export const getMessages = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const chatRoomId = await getChatRoomId(id, userId);

    const chatRoom = await ChatRoom.findById(chatRoomId).populate("messages");

    if (!chatRoom) return res.status(404).json({ msg: "No chat rooms found" });

    res.status(200).json(chatRoom.messages);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
