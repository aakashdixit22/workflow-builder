import mongoose from 'mongoose';

const StepSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['clean-text', 'summarize', 'extract-key-points', 'tag-category'],
  },
}, { _id: false });

const WorkflowSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  steps: {
    type: [StepSchema],
    required: true,
    validate: {
      validator: function(v) {
        return v.length >= 2 && v.length <= 4;
      },
      message: 'Workflow must have between 2 and 4 steps',
    },
  },
}, {
  timestamps: true,
});

// Prevent model recompilation during hot reload in development
export default mongoose.models.Workflow || mongoose.model('Workflow', WorkflowSchema);
