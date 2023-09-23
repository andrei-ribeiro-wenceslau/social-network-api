const { Schema, model } = require("mongoose");

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      validate: [
        // Using the validate property to define custom validation
        {
          validator: function (text) {
            return text.length >= 1 && text.length <= 280;
          },
          message: "Thought text must be between 1 and 280 characters",
        },
      ],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: function (createdAt) {
        // Using a getter method to format the timestamp
        // Format the date using the custom format ISO string
        return createdAt.toISOString();
      },
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

// Initialize our Thought model
const Thought = model("thought", thoughtSchema);

module.exports = Thought;
