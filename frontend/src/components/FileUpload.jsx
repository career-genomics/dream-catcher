// src/components/FileUpload.jsx - With upload status
import React, { useRef } from 'react';

const FileUpload = ({ onFileSelect, selectedFile, uploadStatus = 'pending' }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF or DOCX file.');
      fileInputRef.current.value = '';
      return;
    }

    // Pass the file to parent component for upload
    onFileSelect(file);
  };

  const triggerFileInput = () => {
    // Only trigger if not currently uploading
    if (uploadStatus !== 'uploading') {
      fileInputRef.current.click();
    }
  };

  const getUploadStatusIndicator = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <div className="upload-status uploading">Uploading...</div>;
      case 'success':
        return <div className="upload-status success">✓ Uploaded successfully</div>;
      case 'error':
        return <div className="upload-status error">✗ Upload failed</div>;
      default:
        return null;
    }
  };

  return (
    <div className="file-upload-container">
      <h2>Upload Resume</h2>
      <p className="input-description">
        Upload your resume in PDF or DOCX format.
      </p>
      <div
        className={`upload-area ${uploadStatus === 'uploading' ? 'uploading' : ''}`}
        onClick={triggerFileInput}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.docx"
          style={{ display: 'none' }}
        />
        {selectedFile ? (
          <div className="file-info">
            <p>{selectedFile.name}</p>
            <span>{(selectedFile.size / 1024).toFixed(2)} KB</span>
            {getUploadStatusIndicator()}
          </div>
        ) : (
          <div className="upload-prompt">
            <span className="upload-icon">📄</span>
            <p>Click to upload your resume (PDF or DOCX)</p>
          </div>
        )}
      </div>
      {selectedFile && uploadStatus !== 'uploading' && (
        <button
          className="text-button"
          onClick={() => {
            onFileSelect(null);
            fileInputRef.current.value = '';
          }}
        >
          Remove file
        </button>
      )}
    </div>
  );
};

export default FileUpload;