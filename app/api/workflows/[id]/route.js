import { NextResponse } from 'next/server';
import { getWorkflowById, deleteWorkflow } from '../../../../lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const workflow = await getWorkflowById(id);
    
    if (!workflow) {
      return NextResponse.json(
        {
          success: false,
          error: 'Workflow not found',
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      workflow: {
        ...workflow,
        _id: workflow._id.toString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result = await deleteWorkflow(id);
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Workflow not found',
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Workflow deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
