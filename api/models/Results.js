import mongoose from 'mongoose';

const ResultsSchema = new mongoose.Schema(
  {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true,
    },
    result: {
      type: Number,
      required: true,
    },
    esse: {
      type: String,
    }
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Results', ResultsSchema);