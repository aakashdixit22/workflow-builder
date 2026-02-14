'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const STEP_TYPES = {
  'clean-text': 'Clean Text',
  'summarize': 'Summarize',
  'extract-key-points': 'Extract Key Points',
  'tag-category': 'Tag Category',
};

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRun, setSelectedRun] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/history?limit=10');
      if (response.data.success) {
        setHistory(response.data.history);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusBadge = (status) => {
    if (status === 'completed') {
      return (
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
          ✅ Completed
        </span>
      );
    }
    return (
      <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
        ❌ Failed
      </span>
    );
  };

  return (
    <div className="px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Run History</h1>
            <p className="text-lg text-gray-600">
              View your recent workflow executions
            </p>
          </div>
          <button
            onClick={fetchHistory}
            disabled={loading}
            className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            {loading ? 'Loading...' : '🔄 Refresh'}
          </button>
        </div>
      </div>

      {loading && history.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      ) : history.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 text-lg">
            No workflow runs yet. Run a workflow to see history here!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* History List */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Recent Runs ({history.length})
              </h2>
              <div className="space-y-3">
                {history.map((run) => (
                  <div
                    key={run._id}
                    onClick={() => setSelectedRun(run)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                      selectedRun?._id === run._id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {run.workflowName || 'Unnamed Workflow'}
                      </h3>
                      {getStatusBadge(run.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {formatDate(run.createdAt)}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {run.steps?.map((step, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded"
                        >
                          {STEP_TYPES[step.type] || step.type}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Run Details */}
          <div>
            {!selectedRun ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500">
                  Select a run from the left to view details
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {selectedRun.workflowName || 'Unnamed Workflow'}
                    </h2>
                    {getStatusBadge(selectedRun.status)}
                  </div>
                  <p className="text-sm text-gray-600">
                    Executed: {formatDate(selectedRun.createdAt)}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Input Text:</h3>
                  <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 max-h-32 overflow-y-auto">
                    {selectedRun.inputText}
                  </div>
                </div>

                {selectedRun.status === 'failed' && selectedRun.error && (
                  <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded">
                    <h3 className="font-semibold text-red-900 mb-2">Error:</h3>
                    <p className="text-sm text-red-700">{selectedRun.error}</p>
                  </div>
                )}

                {selectedRun.results && selectedRun.results.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Step Results:
                    </h3>
                    <div className="space-y-4">
                      {selectedRun.results.map((result, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center mb-2">
                            <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded mr-2">
                              Step {index + 1}
                            </span>
                            <span className="font-medium text-gray-900">
                              {STEP_TYPES[result.step] || result.step}
                            </span>
                          </div>
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-xs text-gray-500 mb-1">Output:</p>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                              {result.output}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
