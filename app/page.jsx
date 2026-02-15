'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const STEP_TYPES = [
  { value: 'clean-text', label: 'Clean Text', description: 'Remove formatting, fix typos' },
  { value: 'summarize', label: 'Summarize', description: 'Create concise summary' },
  { value: 'extract-key-points', label: 'Extract Key Points', description: 'Extract main points' },
  { value: 'tag-category', label: 'Tag Category', description: 'Categorize content' },
];

export default function Home() {
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [selectedSteps, setSelectedSteps] = useState([]);
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const response = await axios.get('/api/workflows');
      if (response.data.success) {
        setWorkflows(response.data.workflows);
      }
    } catch (error) {
      console.error('Failed to fetch workflows:', error);
    }
  };

  const handleCreateWorkflow = async (e) => {
    e.preventDefault();
    setError('');
    
    if (selectedSteps.length < 2 || selectedSteps.length > 4) {
      setError('Please select 2-4 steps');
      return;
    }
    
    try {
      const response = await axios.post('/api/workflows', {
        name: workflowName,
        description: workflowDescription,
        steps: selectedSteps.map((type) => ({ type })),
      });
      
      if (response.data.success) {
        setWorkflowName('');
        setWorkflowDescription('');
        setSelectedSteps([]);
        setShowCreateForm(false);
        fetchWorkflows();
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create workflow');
    }
  };

  const handleRunWorkflow = async (e) => {
    e.preventDefault();
    setError('');
    setResults([]);
    
    if (!inputText.trim()) {
      setError('Please enter some text to process');
      return;
    }
    
    if (!selectedWorkflow) {
      setError('Please select a workflow');
      return;
    }
    
    setIsRunning(true);
    
    try {
      const response = await axios.post('/api/workflows/run', {
        workflowId: selectedWorkflow._id,
        workflowName: selectedWorkflow.name,
        inputText,
        steps: selectedWorkflow.steps,
      });
      
      if (response.data.success) {
        setResults(response.data.results);
        setInputText('');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to run workflow');
    } finally {
      setIsRunning(false);
    }
  };

  const toggleStep = (stepType) => {
    if (selectedSteps.includes(stepType)) {
      setSelectedSteps(selectedSteps.filter((s) => s !== stepType));
    } else {
      if (selectedSteps.length < 4) {
        setSelectedSteps([...selectedSteps, stepType]);
      }
    }
  };

  const deleteWorkflow = async (id) => {
    if (!confirm('Are you sure you want to delete this workflow?')) {
      return;
    }
    
    try {
      await axios.delete(`/api/workflows/${id}`);
      fetchWorkflows();
      if (selectedWorkflow?._id === id) {
        setSelectedWorkflow(null);
      }
    } catch (error) {
      setError('Failed to delete workflow');
    }
  };

  return (
    <div className="px-2 sm:px-4 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
          Welcome to Workflow Builder
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          Create automated text processing workflows with AI-powered steps
        </p>
      </div>

      {error && (
        <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm sm:text-base">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Left Column - Workflow Management */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Your Workflows</h2>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition text-sm sm:text-base"
              >
                {showCreateForm ? 'Cancel' : '+ New Workflow'}
              </button>
            </div>

            {showCreateForm && (
              <form onSubmit={handleCreateWorkflow} className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Workflow Name *
                  </label>
                  <input
                    type="text"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Article Processor"
                    required
                  />
                </div>

                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={workflowDescription}
                    onChange={(e) => setWorkflowDescription(e.target.value)}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="What does this workflow do?"
                    rows="2"
                  />
                </div>

                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Select Steps (2-4) *
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {STEP_TYPES.map((step) => (
                      <div
                        key={step.value}
                        onClick={() => toggleStep(step.value)}
                        className={`p-2 sm:p-3 border-2 rounded-lg cursor-pointer transition ${
                          selectedSteps.includes(step.value)
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 text-sm sm:text-base">{step.label}</div>
                            <div className="text-xs sm:text-sm text-gray-600">{step.description}</div>
                          </div>
                          {selectedSteps.includes(step.value) && (
                            <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded flex-shrink-0">
                              #{selectedSteps.indexOf(step.value) + 1}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Selected: {selectedSteps.length}/4 steps
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 sm:py-2.5 rounded-md font-medium transition text-sm sm:text-base"
                >
                  Create Workflow
                </button>
              </form>
            )}

            <div className="space-y-2 sm:space-y-3">
              {workflows.length === 0 ? (
                <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">
                  No workflows yet. Create your first workflow!
                </p>
              ) : (
                workflows.map((workflow) => (
                  <div
                    key={workflow._id}
                    className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition ${
                      selectedWorkflow?._id === workflow._id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedWorkflow(workflow)}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base break-words">{workflow.name}</h3>
                        {workflow.description && (
                          <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">{workflow.description}</p>
                        )}
                        <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                          {workflow.steps.map((step, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded whitespace-nowrap"
                            >
                              {index + 1}. {STEP_TYPES.find((s) => s.value === step.type)?.label}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteWorkflow(workflow._id);
                        }}
                        className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0 p-1 text-lg sm:text-xl"
                        aria-label="Delete workflow"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Run Workflow */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Run Workflow</h2>

            {!selectedWorkflow ? (
              <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">
                Select a workflow from the left to get started
              </p>
            ) : (
              <form onSubmit={handleRunWorkflow}>
                <div className="mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Input Text *
                  </label>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter the text you want to process..."
                    rows="6"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isRunning}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2.5 sm:py-3 rounded-md font-medium transition text-sm sm:text-base"
                >
                  {isRunning ? 'Processing...' : '▶ Run Workflow'}
                </button>
              </form>
            )}
          </div>

          {results.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Results</h2>
              <div className="space-y-3 sm:space-y-4">
                {results.map((result, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded">
                        Step {index + 1}
                      </span>
                      <span className="font-medium text-gray-900 text-sm sm:text-base">
                        {STEP_TYPES.find((s) => s.value === result.step)?.label}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded text-xs sm:text-sm text-gray-700 whitespace-pre-wrap break-words overflow-x-auto">
                      {result.output}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
