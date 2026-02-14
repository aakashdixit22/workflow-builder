import { NextResponse } from 'next/server';
import {
  getWorkflows,
  createWorkflow,
} from '../../../lib/db';

export async function GET() {
  try {
    const workflows = await getWorkflows();
    
    // Convert MongoDB ObjectId to string for JSON serialization
    const serializedWorkflows = workflows.map((workflow) => ({
      ...workflow,
      _id: workflow._id.toString(),
    }));
    
    return NextResponse.json({ success: true, workflows: serializedWorkflows });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { name, description, steps } = await request.json();
    
    if (!name || !steps || steps.length < 2 || steps.length > 4) {
      return NextResponse.json(
        {
          success: false,
          error: 'Workflow must have a name and 2-4 steps',
        },
        { status: 400 }
      );
    }
    
    const workflowData = {
      name,
      description: description || '',
      steps,
    };
    
    const result = await createWorkflow(workflowData);
    
    return NextResponse.json(
      {
        success: true,
        workflowId: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
