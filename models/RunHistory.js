import mongoose from 'mongoose';

const StepSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
}, { _id: false });

const ResultSchema = new mongoose.Schema({
  step: {
    type: String,
    required: true,
  },
  input: {
    type: String,
    required: true,
  },
  output: {
    type: String,
    required: true,
  },
}, { _id: false });

const RunHistorySchema = new mongoose.Schema({
  workflowId: {
    type: String,
    required: true,
  },
  workflowName: {
    type: String,
    required: true,
  },
  inputText: {
    type: String,
    required: true,
  },
  steps: {
    type: [StepSchema],
    required: true,
  },
  results: {
    type: [ResultSchema],
    default: [],
  },
  status: {
    type: String,
    required: true,
    enum: ['completed', 'failed'],
  },
  error: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

// Create index for better query performance
RunHistorySchema.index({ createdAt: -1 });
RunHistorySchema.index({ workflowId: 1 });

// Prevent model recompilation during hot reload in development
export default mongoose.models.RunHistory || mongoose.model('RunHistory', RunHistorySchema);
