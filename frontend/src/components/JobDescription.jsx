// src/components/JobDescription.jsx - With upload status
import React from 'react';

const JobDescription = ({ value, onChange, uploadStatus = 'pending', onSubmit }) => {
  const handleTextChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const getUploadStatusIndicator = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <div className="upload-status uploading">Submitting...</div>;
      case 'success':
        return <div className="upload-status success">✓ Submitted successfully</div>;
      case 'error':
        return <div className="upload-status error">✗ Submission failed</div>;
      default:
        return null;
    }
  };

  return (
    <div className="job-description-container">
      <h2>Job Description</h2>
      <p className="input-description">
        Paste the job description text here. The more detailed the job description,
        the more accurate the analysis will be.
      </p>
      <textarea
        value={value}
        onChange={handleTextChange}
        placeholder="Paste or type the job description here..."
        rows={10}
        className={`job-description-textarea ${uploadStatus === 'uploading' ? 'disabled' : ''}`}
        disabled={uploadStatus === 'uploading'}
      />

      {getUploadStatusIndicator()}

      {value && value.trim().length > 0 && uploadStatus === 'pending' && (
        <button
          onClick={onSubmit}
          className="text-button submit-jd-button"
        >
          Submit Job Description
        </button>
      )}
    </div>
  );
};

export default JobDescription;