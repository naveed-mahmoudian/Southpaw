import User from "../../models/User.js";
import ChatRoom from "../../models/ChatRoom.js";
import getChatRoomId from "../../utils/getChatRoomId.js";
import Message from "../../models/Message.js";
import Fight from "../../models/Fight.js";
import dealPunishment from "../../utils/dealPunishment.js";

export const addFight = async (req, res) => {
  try {
    let isMatch = false;
    const { id } = req.params;
    const { userId } = req.body;

    const searchUser = await User.findById(userId);
    const fightsArray = searchUser.fights;
    if (fightsArray.includes(id)) {
      isMatch = true;

      const newChatRoom = await ChatRoom.create({
        users: [id, userId],
      });

      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          $addToSet: { matches: userId, chat_rooms: newChatRoom._id },
        },
        { new: true }
      );

      if (!updatedUser) return res.status(404).json({ msg: "No user found" });

      await User.findByIdAndUpdate(
        userId,
        {
          $pull: { fights: id },
          $addToSet: { matches: id, chat_rooms: newChatRoom._id },
        },
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

    const chatRoom = await ChatRoom.findOne({
      users: { $all: [id, userId] },
    });

    const updatedCurrentUser = await User.findByIdAndUpdate(
      id,
      { $pull: { matches: userId, chat_rooms: chatRoom._id } },
      { new: true }
    );

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { matches: id, chat_rooms: chatRoom._id } },
      { new: true }
    );

    const removedChatRoom = await ChatRoom.findByIdAndDelete(chatRoom._id);

    res.status(201).json(updatedCurrentUser);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, message } = req.body;
    const chatRoomId = await getChatRoomId(id, userId);

    const newMessage = await Message.create({
      fromId: id,
      toId: userId,
      message: message,
    });

    if (!newMessage)
      return res.status(400).json({ msg: "Could not create message" });

    const updatedFromUser = await User.findByIdAndUpdate(
      id,
      {
        $push: { messages: newMessage._id },
      },
      { new: true }
    );

    if (!updatedFromUser)
      return res
        .status(400)
        .json({ msg: "Could not add message to FROM user" });

    const updatedChatRoom = await ChatRoom.findByIdAndUpdate(
      chatRoomId,
      {
        $push: { messages: newMessage._id },
      },
      { new: true }
    ).populate("messages");

    if (!updatedChatRoom)
      return res
        .status(400)
        .json({ msg: "Could not update chat room messages" });

    res.status(201).json({ messageSent: true });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const endFight = async (req, res) => {
  try {
    const { winnerId, loserId } = req.body;

    const newFight = await Fight.create({
      winner: winnerId,
      loser: loserId,
    });

    const populatedFight = await Fight.findById(newFight._id)
      .populate("winner")
      .populate("loser");

    res.status(201).json(populatedFight);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

export const compareFight = async (req, res) => {
  try {
    let isMatch = false;
    const { id } = req.params;
    const { fightId, winnerId, loserId } = req.body;

    const fight = await Fight.findById(fightId);

    if (fight.isResolved)
      res.status(200).json({ msg: "Fight is already resolved" });

    if (
      fight.winner.toString() === winnerId &&
      fight.loser.toString() === loserId
    ) {
      isMatch = true;

      const updatedFight = await Fight.findByIdAndUpdate(
        fightId,
        { isResolved: true },
        { new: true }
      );

      const updatedWinner = await User.findByIdAndUpdate(
        winnerId,
        {
          $inc: { wins: 1 },
          $pull: { matches: loserId },
        },
        { new: true }
      );

      const updatedLoser = await User.findByIdAndUpdate(
        loserId,
        {
          $inc: { losses: 1 },
          $pull: { matches: winnerId },
        },
        { new: true }
      );

      res
        .status(201)
        .json({ msg: "Match", isMatch: isMatch, fight: updatedFight });
    } else {
      isMatch = false;

      const user1Punishment = await dealPunishment(winnerId);
      const user2Punishment = await dealPunishment(loserId);

      const chatRoomId = await getChatRoomId(winnerId, loserId);

      const updatedUser1 = await User.findByIdAndUpdate(
        winnerId,
        { $pull: { matches: loserId, chat_rooms: chatRoomId } },
        { new: true }
      );

      const updatedUser2 = await User.findByIdAndUpdate(
        loserId,
        { $pull: { matches: winnerId, chat_rooms: chatRoomId } },
        { new: true }
      );

      const updatedUser = await User.findById(id);

      const updatedFight = await Fight.findByIdAndUpdate(
        fightId,
        { isResolved: true },
        { new: true }
      );

      await ChatRoom.findByIdAndDelete(chatRoomId);

      res.status(201).json({
        msg: "Not a match",
        isMatch: isMatch,
        user: updatedUser,
        fight: updatedFight,
      });
    }
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

export const removeChatRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const chatRoomId = await getChatRoomId(id, userId);

    const updatedCurrentUser = await User.findByIdAndUpdate(
      id,
      { $pull: { chat_rooms: chatRoomId } },
      { new: true }
    );

    const updatedOtherUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { chat_rooms: chatRoomId } },
      { new: true }
    );

    const removedChatRoom = await ChatRoom.findByIdAndDelete(chatRoomId);

    res.status(200).json(removedChatRoom);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
