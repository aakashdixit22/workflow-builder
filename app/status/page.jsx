'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Status() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState(null);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/status');
      setStatus(response.data);
      setLastChecked(new Date());
    } catch (error) {
      setStatus({
        success: false,
        status: 'unhealthy',
        error: error.message,
      });
      setLastChecked(new Date());
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (serviceStatus) => {
    if (serviceStatus === 'connected' || serviceStatus === 'healthy') {
      return 'bg-green-100 text-green-800 border-green-300';
    }
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const getStatusIcon = (serviceStatus) => {
    if (serviceStatus === 'connected' || serviceStatus === 'healthy') {
      return '✅';
    }
    return '❌';
  };

  return (
    <div className="px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">System Status</h1>
            <p className="text-lg text-gray-600">
              Monitor the health of all system components
            </p>
          </div>
          <button
            onClick={checkStatus}
            disabled={loading}
            className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            {loading ? 'Checking...' : '🔄 Refresh'}
          </button>
        </div>
      </div>

      {lastChecked && (
        <p className="text-sm text-gray-500 mb-6">
          Last checked: {lastChecked.toLocaleTimeString()}
        </p>
      )}

      {loading && !status ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Overall Status */}
          <div
            className={`rounded-lg shadow-md p-6 border-2 ${
              status?.status === 'healthy'
                ? 'bg-green-50 border-green-300'
                : 'bg-red-50 border-red-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Overall System Status
                </h2>
                <p className="text-gray-700">
                  {status?.status === 'healthy'
                    ? 'All systems operational'
                    : status?.status === 'degraded'
                    ? 'Some services are experiencing issues'
                    : 'System is down'}
                </p>
              </div>
              <div className="text-5xl">
                {status?.status === 'healthy' ? '✅' : '⚠️'}
              </div>
            </div>
          </div>

          {/* Individual Services */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Flask Backend */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Flask API</h3>
                <span className="text-3xl">
                  {getStatusIcon(status?.services?.backend?.status)}
                </span>
              </div>
              <div
                className={`px-3 py-2 rounded border ${getStatusColor(
                  status?.services?.backend?.status
                )}`}
              >
                <p className="font-medium">
                  Status:{' '}
                  {status?.services?.backend?.status === 'connected'
                    ? 'Connected'
                    : 'Disconnected'}
                </p>
              </div>
              {status?.services?.backend?.url && (
                <p className="text-sm text-gray-600 mt-2">
                  URL: {status.services.backend.url}
                </p>
              )}
            </div>

            {/* MongoDB */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">MongoDB</h3>
                <span className="text-3xl">
                  {getStatusIcon(status?.services?.database?.status)}
                </span>
              </div>
              <div
                className={`px-3 py-2 rounded border ${getStatusColor(
                  status?.services?.database?.status
                )}`}
              >
                <p className="font-medium">
                  Status:{' '}
                  {status?.services?.database?.status === 'connected'
                    ? 'Connected'
                    : 'Disconnected'}
                </p>
              </div>
              {status?.services?.database?.message && (
                <p className="text-sm text-gray-600 mt-2">
                  {status.services.database.message}
                </p>
              )}
            </div>

            {/* LLM Service */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">LLM Service</h3>
                <span className="text-3xl">
                  {getStatusIcon(status?.services?.llm?.status)}
                </span>
              </div>
              <div
                className={`px-3 py-2 rounded border ${getStatusColor(
                  status?.services?.llm?.status
                )}`}
              >
                <p className="font-medium">
                  Status:{' '}
                  {status?.services?.llm?.status === 'connected'
                    ? 'Connected'
                    : 'Disconnected'}
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Google Gemini Pro
              </p>
            </div>
          </div>

          {/* Troubleshooting */}
          {status?.status !== 'healthy' && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                🔧 Troubleshooting Steps
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {status?.services?.backend?.status !== 'connected' && (
                  <li>
                    Check if Flask API is running on port 5000 (run{' '}
                    <code className="bg-gray-200 px-2 py-1 rounded">python app.py</code>{' '}
                    in flask-api folder)
                  </li>
                )}
                {status?.services?.database?.status !== 'connected' && (
                  <li>
                    Ensure MongoDB is running locally or check your MONGODB_URI in
                    .env.local
                  </li>
                )}
                {status?.services?.llm?.status !== 'connected' && (
                  <li>
                    Verify your Gemini API key is set in flask-api/.env file
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
