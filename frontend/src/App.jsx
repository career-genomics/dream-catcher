// src/App.jsx - Updated to use real API calls
import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import JobDescription from './components/JobDescription';
import ResultDisplay from './components/ResultDisplay';
import { uploadResume, submitJobDescription, getMatchResults } from './services/api';
import './App.css';

function App() {
  const [resume, setResume] = useState(null);
  const [resumeId, setResumeId] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [jobDescriptionId, setJobDescriptionId] = useState(null);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({
    resume: 'pending', // 'pending', 'uploading', 'success', 'error'
    jobDescription: 'pending' // 'pending', 'uploading', 'success', 'error'
  });
  const [error, setError] = useState(null);

  // Handle resume upload
  const handleResumeUpload = async (file) => {
    setResume(file);
    if (!file) {
      setResumeId(null);
      return;
    }

    console.log("Resume file selected:", file.name, file.size, "bytes");
  };

  // Handle job description change
  const handleJobDescriptionChange = (text) => {
    setJobDescription(text);
    // Reset the job description ID when the text changes
    if (jobDescriptionId) {
      setJobDescriptionId(null);
    }
  };

  // Main submit handler for matching
  const handleSubmit = async () => {
    if (!resume) {
      setError('Please upload a resume.');
      return;
    }

    if (!jobDescription) {
      setError('Please enter a job description.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Starting resume matching process...");

      // Step 1: Upload resume to get resumeId
      console.log("Uploading resume...");
      setUploadStatus(prev => ({ ...prev, resume: 'uploading' }));
      const resumeFormData = new FormData();
      resumeFormData.append('resume', resume);

      const resumeResponse = await uploadResume(resume);
      console.log("Resume upload response:", resumeResponse);
      setResumeId(resumeResponse.resumeId);
      setUploadStatus(prev => ({ ...prev, resume: 'success' }));

      // Step 2: Submit job description to get jobDescriptionId
      console.log("Submitting job description...");
      setUploadStatus(prev => ({ ...prev, jobDescription: 'uploading' }));

      const jdResponse = await submitJobDescription(jobDescription);
      console.log("Job description submit response:", jdResponse);
      setJobDescriptionId(jdResponse.jobDescriptionId);
      setUploadStatus(prev => ({ ...prev, jobDescription: 'success' }));

      // Step 3: Get match results using both IDs
      console.log("Getting match results...");
      const matchResults = await getMatchResults(resumeResponse.resumeId, jdResponse.jobDescriptionId);
      console.log("Match results:", matchResults);

      // Set the results to state to display them
      setResults(matchResults);
    } catch (err) {
      console.error("Error during matching process:", err);
      setError('An error occurred while processing your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setResume(null);
    setResumeId(null);
    setJobDescription('');
    setJobDescriptionId(null);
    setResults(null);
    setError(null);
    setUploadStatus({
      resume: 'pending',
      jobDescription: 'pending'
    });
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Career Genomics</h1>
      </header>

      {!results ? (
        <div className="input-section">
          <div className="section-header">
            <h2>Upload your resume and job description</h2>
            <p>Our AI will analyze how well your resume matches the job requirements</p>
          </div>

          <div className="upload-grid">
            <FileUpload
              onFileSelect={handleResumeUpload}
              selectedFile={resume}
              uploadStatus={uploadStatus.resume}
            />
            <JobDescription
              value={jobDescription}
              onChange={handleJobDescriptionChange}
              uploadStatus={uploadStatus.jobDescription}
            />
          </div>

          <div className="actions">
            <button
              onClick={handleSubmit}
              disabled={isLoading || !resume || !jobDescription}
              className="primary-button"
            >
              {isLoading ? 'Analyzing...' : 'Match Resume with Job'}
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {isLoading && (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Analyzing your resume against the job description...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="results-section">
          <ResultDisplay results={results} />
          <div className="actions">
            <button onClick={resetForm} className="secondary-button">
              Start New Match
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;