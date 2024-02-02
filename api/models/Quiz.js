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
    langLevel: {
      type: String,
      required: true
    },
    video: {
      type: String
    },
    file: {
      type: String
    },
    audio: {
      type: Array
    },
    open: {
      type: Boolean,
      default: true
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Quiz', QuizSchema);