import User from "../models/User.js";

const dealPunishment = async (id) => {
  let punishment;
  try {
    const punishedUser = await User.findById(id);

    if (punishedUser.strikes === 0) {
      punishment = "warning";

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $inc: { strikes: 1 } },
        { new: true }
      );

      return punishment;
    } else if (punishedUser.strikes === 1) {
      punishment = "temp_ban";

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $inc: { strikes: 1 }, isDeactivated: true },
        { new: true }
      );

      return punishment;
    } else if (punishedUser.strikes === 2) {
      punishment = "ban";

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $inc: { strikes: 1 }, isBanned: true },
        { new: true }
      );

      return punishment;
    }
  } catch (err) {
    console.error(err.message);
  }
};

export default dealPunishment;
