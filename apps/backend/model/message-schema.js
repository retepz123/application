import { Schema } from 'mongoose';
import mongoose from 'mongoose';

const messageSchema = new Schema ({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  context: {
    type: String,
  },
  image: {
    type: String
  },

}, {timestamps: true });

export const Message = mongoose.model('Message', messageSchema);