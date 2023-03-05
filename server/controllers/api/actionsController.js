import User from "../../models/User.js";
import ChatRoom from "../../models/ChatRoom.js";
import getChatRoomId from "../../utils/getChatRoomId.js";
import Message from "../../models/Message.js";

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
