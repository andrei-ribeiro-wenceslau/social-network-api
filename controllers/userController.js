const { User, Thought } = require("../models");

module.exports = {

   // Get all users
  async getUsers(req, res) {
    try {
      const allUsers = await User.find();
      res.json(allUsers);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  },

   // Get a single user by ID and populate their thoughts and friends
  async getSingleUser(req, res) {
    try {
      const singleUser = await User.findOne({ _id: req.params.userId })
        .select("-__v")
        .populate({
          path: "thoughts",
          select: "-__v",
        })
        .populate({
          path: "friends",
          select: "-__v",
        });
      if (!singleUser) {
        return res.status(404).json({ message: "No user with that ID" });
      }
      res.json(singleUser);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  },

   // Create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  },

  // Update an existing user by ID
  async updateUser(req, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "No user with that ID" });
      }
      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  },
  
  // Delete a user by ID and their associated thoughts
  async deleteUser(req, res) {
    try {
      const deletedUser = await User.findOneAndDelete({ _id: req.params.userId });
      if (!deletedUser) {
        return res.status(404).json({ message: "No user with that ID" });
      }
      await Thought.deleteMany({ _id: { $in: deletedUser.thoughts } });
      res.json({ message: "User and associated thoughts deleted!" });
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  },

   // Add a friend to a user's friends list
  async friend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $push: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }
      res.json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  },
  
  // Remove a friend from a user's friends list
  async unfriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }
      res.json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  },
};