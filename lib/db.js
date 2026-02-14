import connectDB from './mongodb';
import Workflow from '../models/Workflow';
import RunHistory from '../models/RunHistory';

// Workflow CRUD operations
export async function createWorkflow(workflowData) {
  try {
    await connectDB();
    const workflow = await Workflow.create(workflowData);
    return { insertedId: workflow._id };
  } catch (error) {
    throw new Error(`Failed to create workflow: ${error.message}`);
  }
}

export async function getWorkflows() {
  try {
    await connectDB();
    const workflows = await Workflow.find({})
      .sort({ createdAt: -1 })
      .lean();
    return workflows;
  } catch (error) {
    throw new Error(`Failed to fetch workflows: ${error.message}`);
  }
}

export async function getWorkflowById(id) {
  try {
    await connectDB();
    const workflow = await Workflow.findById(id).lean();
    return workflow;
  } catch (error) {
    throw new Error(`Failed to fetch workflow: ${error.message}`);
  }
}

export async function deleteWorkflow(id) {
  try {
    await connectDB();
    const result = await Workflow.deleteOne({ _id: id });
    return { deletedCount: result.deletedCount };
  } catch (error) {
    throw new Error(`Failed to delete workflow: ${error.message}`);
  }
}

// Run History operations
export async function saveRunHistory(runData) {
  try {
    await connectDB();
    const run = await RunHistory.create(runData);
    return { insertedId: run._id };
  } catch (error) {
    throw new Error(`Failed to save run history: ${error.message}`);
  }
}

export async function getRunHistory(limit = 5) {
  try {
    await connectDB();
    const history = await RunHistory.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return history;
  } catch (error) {
    throw new Error(`Failed to fetch run history: ${error.message}`);
  }
}

export async function checkDatabaseConnection() {
  try {
    await connectDB();
    // Check if connection is ready
    const state = require('mongoose').connection.readyState;
    if (state === 1) {
      return { status: 'connected', message: 'Database connection successful' };
    } else {
      return { status: 'disconnected', message: 'Database not connected' };
    }
  } catch (error) {
    return { status: 'disconnected', message: error.message };
  }
}
