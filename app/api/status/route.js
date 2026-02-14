import { NextResponse } from 'next/server';
import axios from 'axios';
import { checkDatabaseConnection } from '../../../lib/db';

export async function GET() {
  try {
    const flaskApiUrl = process.env.FLASK_API_URL || 'http://localhost:5000';
    
    // Check Flask API health
    let flaskStatus = 'disconnected';
    let llmStatus = 'disconnected';
    
    try {
      const flaskResponse = await axios.get(`${flaskApiUrl}/health`, {
        timeout: 5000,
      });
      
      if (flaskResponse.data.status === 'healthy') {
        flaskStatus = 'connected';
        llmStatus = flaskResponse.data.llm_connection === 'connected' 
          ? 'connected' 
          : 'disconnected';
      }
    } catch (error) {
      console.error('Flask API health check failed:', error.message);
    }
    
    // Check MongoDB connection
    const dbStatus = await checkDatabaseConnection();
    
    const overallStatus = 
      flaskStatus === 'connected' && 
      dbStatus.status === 'connected' && 
      llmStatus === 'connected'
        ? 'healthy'
        : 'degraded';
    
    return NextResponse.json({
      success: true,
      status: overallStatus,
      services: {
        backend: {
          status: flaskStatus,
          url: flaskApiUrl,
        },
        database: {
          status: dbStatus.status,
          message: dbStatus.message,
        },
        llm: {
          status: llmStatus,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        status: 'unhealthy',
      },
      { status: 500 }
    );
  }
}
