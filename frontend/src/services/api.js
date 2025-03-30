// src/services/api.js - Enhanced with detailed logging
import axios from 'axios';

// Get the base URL from environment variables
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
console.log('API Base URL configured as:', API_BASE_URL);

// Base configuration for API requests
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * Upload resume file to the server
 * @param {File} resumeFile - The resume file (PDF or DOCX)
 * @returns {Promise} Promise with the upload response
 */
// src/services/api.js - Fixed resume upload function
export const uploadResume = async (resumeFile) => {
  console.log(`Uploading resume: ${resumeFile.name} (${resumeFile.size} bytes, type: ${resumeFile.type})`);
  try {
    const formData = new FormData();

    // The key name might need to match exactly what the backend expects
    // Try different field names that your backend might expect
    formData.append('file', resumeFile);

    // Log the form data to debug
    console.log("Form data keys:", [...formData.keys()]);

    console.log(`Sending resume to ${API_BASE_URL}/v1/upload-resume`);
    const response = await apiClient.post('/v1/upload-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log("Resume upload successful, response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error uploading resume:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

/**
 * Get match results
 * @param {string} resumeId - The ID of the uploaded resume
 * @param {string} jobDescriptionId - The ID of the submitted job description
 * @returns {Promise} Promise with the matching results
 */
export const getMatchResults = async (resumeId, jobDescriptionId) => {
  console.log(`Getting match results for resumeId: ${resumeId}, jobDescriptionId: ${jobDescriptionId}`);
  try {
    console.log(`Sending match request to ${API_BASE_URL}/v1/match`);
    const response = await apiClient.get('/v1/match', {
      params: {
        resumeId,
        jobDescriptionId
      }
    });

    console.log("Match results received successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting match results:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

/**
 * Submit job description to the server
 * @param {string} jobDescription - The job description text
 * @returns {Promise} Promise with the submission response
 */
// src/services/api.js - Fixed job description submission function
export const submitJobDescription = async (jobDescription) => {
  console.log(`Submitting job description (${jobDescription.length} characters)`);
  try {

    const requestBody = {
      content: jobDescription
    };

    // Format 5: Using FormData like the resume upload
    const formData = new FormData();
    formData.append('jobDescription', jobDescription);

    console.log(`Sending job description to ${API_BASE_URL}/v1/submit-jd`);
    console.log("Using request body format:", requestBody);

    // Try with the first format, but you can swap to others if this fails
    const response = await apiClient.post('/v1/submit-jd', requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log("Job description submission successful, response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error submitting job description:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);

      // If first format failed with 422, try the second format
      if (error.response.status === 422) {
        try {
          console.log("First format failed, trying with format 2");
          const response = await apiClient.post('/v1/submit-jd', {
            text: jobDescription
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          console.log("Second format succeeded, response:", response.data);
          return response.data;
        } catch (retryError) {
          console.error("Second format also failed:", retryError);
          throw retryError;
        }
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};
