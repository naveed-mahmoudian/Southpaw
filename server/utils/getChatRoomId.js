import User from "../models/User.js";
import ChatRoom from "../models/ChatRoom.js";

const getChatRoomId = async (fromUserId, toUserId) => {
  try {
    const chatRoom = await ChatRoom.find({
      users: {
        $size: 2,
        $all: [fromUserId, toUserId],
      },
    });

    const chatRoomId = chatRoom[0]._id.toString();

    return chatRoomId;
  } catch (err) {
    console.error(err.message);
  }
};

export default getChatRoomId;
