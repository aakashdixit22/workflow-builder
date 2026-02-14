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
    <div className="px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Workflow Builder
        </h1>
        <p className="text-lg text-gray-600">
          Create automated text processing workflows with AI-powered steps
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Workflow Management */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Your Workflows</h2>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                {showCreateForm ? 'Cancel' : '+ New Workflow'}
              </button>
            </div>

            {showCreateForm && (
              <form onSubmit={handleCreateWorkflow} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Workflow Name *
                  </label>
                  <input
                    type="text"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Article Processor"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={workflowDescription}
                    onChange={(e) => setWorkflowDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="What does this workflow do?"
                    rows="2"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Steps (2-4) *
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {STEP_TYPES.map((step) => (
                      <div
                        key={step.value}
                        onClick={() => toggleStep(step.value)}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition ${
                          selectedSteps.includes(step.value)
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-gray-900">{step.label}</div>
                            <div className="text-sm text-gray-600">{step.description}</div>
                          </div>
                          {selectedSteps.includes(step.value) && (
                            <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded">
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
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-md font-medium transition"
                >
                  Create Workflow
                </button>
              </form>
            )}

            <div className="space-y-3">
              {workflows.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No workflows yet. Create your first workflow!
                </p>
              ) : (
                workflows.map((workflow) => (
                  <div
                    key={workflow._id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                      selectedWorkflow?._id === workflow._id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedWorkflow(workflow)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
                        {workflow.description && (
                          <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {workflow.steps.map((step, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded"
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
                        className="ml-4 text-red-500 hover:text-red-700"
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
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Run Workflow</h2>

            {!selectedWorkflow ? (
              <p className="text-gray-500 text-center py-8">
                Select a workflow from the left to get started
              </p>
            ) : (
              <form onSubmit={handleRunWorkflow}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Input Text *
                  </label>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter the text you want to process..."
                    rows="6"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isRunning}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-md font-medium transition"
                >
                  {isRunning ? 'Processing...' : '▶ Run Workflow'}
                </button>
              </form>
            )}
          </div>

          {results.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Results</h2>
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded mr-2">
                        Step {index + 1}
                      </span>
                      <span className="font-medium text-gray-900">
                        {STEP_TYPES.find((s) => s.value === result.step)?.label}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 whitespace-pre-wrap">
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
