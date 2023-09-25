const { User, Thought } = require("../models");

module.exports = {
  // Get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find().populate({
        path: "reactions",
        select: "-__v",
      });
      res.json(thoughts);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get a single thought by ID and populate their reactions
  async getSingleThought({ params }, res) {
    try {
      const thought = await Thought.findOne({  _id: params.id })
        .select("-__v")
        .populate({
          path: "reactions",
          select: "-__v",
        });
      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }
      res.json(thought);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // Create a new thought
  async createThought(req, res) {
    try {
      const thoughtData = req.body;

      // Create a new thought in the database
      const thought = await Thought.create(thoughtData);

      // Update the user with the new thought ID
      const user = await User.findByIdAndUpdate(
        thoughtData.userId,
        {
          $addToSet: { thoughts: thought._id },
        },
        { new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: "No user with that ID, but thought was created" });
      }

      // Send a JSON response with the created thought object
      res.json(thought);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // Update an existing thought by ID
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.id }, // Assuming the route parameter is named 'id'
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }
      res.json(thought);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // Delete a thought by ID and their associated thoughts
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.id });

      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }

      const user = await User.findOneAndUpdate(
        { thoughts: req.params.id },
        { $pull: { thoughts: req.params.id } },
        { new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: "Thought deleted but no user with this id!" });
      }

      res.json({ message: "Thought successfully deleted!" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // Add a reaction
  async addReaction({ params, body }, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $addToSet: { reactions: body } },
        { new: true, runValidators: true }
      );

      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }

      res.json(thought);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // Remove a reaction
  async removeReaction({ params }, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { new: true }
      );
      
      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }
      
      res.json(thought);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};
