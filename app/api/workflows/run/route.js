import { NextResponse } from 'next/server';
import axios from 'axios';
import { saveRunHistory } from '../../../../lib/db';

export async function POST(request) {
  try {
    const { workflowId, workflowName, inputText, steps } = await request.json();
    
    if (!inputText || !steps || steps.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: 'Input text and at least 2 steps are required',
        },
        { status: 400 }
      );
    }
    
    const flaskApiUrl = process.env.FLASK_API_URL || 'http://localhost:5000';
    
    // Execute workflow through Flask API
    const response = await axios.post(`${flaskApiUrl}/process/workflow`, {
      text: inputText,
      steps: steps,
    });
    
    if (!response.data.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Workflow execution failed',
        },
        { status: 500 }
      );
    }
    
    // Save to run history
    const runData = {
      workflowId,
      workflowName,
      inputText,
      steps,
      results: response.data.results,
      status: 'completed',
    };
    
    await saveRunHistory(runData);
    
    return NextResponse.json({
      success: true,
      results: response.data.results,
    });
  } catch (error) {
    // Save failed run to history
    try {
      const { workflowId, workflowName, inputText, steps } = await request.json();
      await saveRunHistory({
        workflowId,
        workflowName,
        inputText,
        steps,
        results: [],
        status: 'failed',
        error: error.message,
      });
    } catch (saveError) {
      console.error('Failed to save error to history:', saveError);
    }
    
    return NextResponse.json(
      {
        success: false,
        error: error.response?.data?.error || error.message,
      },
      { status: 500 }
    );
  }
}
