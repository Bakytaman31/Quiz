import mongoose from 'mongoose';

const QuizSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    questions: {
      type: Array,
      required: true,
      default: []
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    video: {
      type: String
    },
    file: {
      type: String
    },
    audio: {
      type: String
    },
    expDate: {
      type: String
    }
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Quiz', QuizSchema);