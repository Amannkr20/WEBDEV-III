const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, index: true },
    sender: { type: String, required: true },
    receiver: { type: String }, // For direct messages
    type: { type: String, enum: ["group", "direct"], default: "group" },
    text: { type: String, default: "" },
    message: { type: String, default: "" }, // Support both text and message field
    file: {
      name: { type: String },
      size: { type: String },
      url: { type: String },
    },
    time: { type: String },
    read: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Pre-save hook to ensure both text and message are in sync
messageSchema.pre("save", function (next) {
  if (this.text && !this.message) {
    this.message = this.text;
  } else if (this.message && !this.text) {
    this.text = this.message;
  }
  next();
});

module.exports = mongoose.model("Message", messageSchema);
