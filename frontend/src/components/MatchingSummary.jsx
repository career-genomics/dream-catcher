// src/components/MatchingSummary.jsx - Updated for backend response format
import React from 'react';

const MatchingSummary = ({ score }) => {
  console.log("Rendering match score:", score);

  // Determine match category based on score
  const getMatchCategory = (score) => {
    if (score >= 80) return { text: 'Excellent Match', color: '#4CAF50' };
    if (score >= 60) return { text: 'Good Match', color: '#8BC34A' };
    if (score >= 40) return { text: 'Fair Match', color: '#FFC107' };
    return { text: 'Needs Improvement', color: '#F44336' };
  };

  const getMatchDescription = (score) => {
    if (score >= 80) return 'Your resume matches most of the key requirements for this job.';
    if (score >= 60) return 'Your resume matches many important requirements, with some areas for improvement.';
    if (score >= 40) return 'Your resume matches some requirements, but has significant gaps.';
    return 'Your resume needs significant improvements to match this job description.';
  };

  const { text, color } = getMatchCategory(score);
  const description = getMatchDescription(score);

  return (
    <div className="matching-summary">
      <div className="score-circle" style={{ borderColor: color }}>
        <span className="score-value" style={{ color }}>
          {Math.round(score)}%
        </span>
      </div>
      <div className="score-details">
        <h3 className="match-category" style={{ color }}>
          {text}
        </h3>
        <p className="match-description">
          {description}
        </p>
      </div>
    </div>
  );
};

export default MatchingSummary;