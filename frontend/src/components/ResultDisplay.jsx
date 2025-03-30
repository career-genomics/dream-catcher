// src/components/ResultDisplay.jsx - Updated for the backend API response format
import React from 'react';
import MatchingSummary from './MatchingSummary';

const ResultDisplay = ({ results }) => {
  if (!results) return null;

  console.log("Rendering results:", results);

  // Extract data from the backend response format
  const { match_score, matching_skills, missing_skills, analysis } = results;

  return (
    <div className="result-display-container">
      <h2>Let's see Career Genome results ......</h2>

      <MatchingSummary score={match_score} />

      {/* Summary Section */}
      {analysis && analysis.summary && (
        <div className="analysis-summary">
          <h3>Analysis Summary</h3>
          <div className="summary-content">
            {analysis.summary.map((item, index) => (
              <p key={index}>{item}</p>
            ))}
          </div>
        </div>
      )}

      <div className="results-grid">
        {/* Matching Skills */}
        <div className="result-section">
          <h3>Matching Skills</h3>

          {/* Technical Skills */}
          {matching_skills && matching_skills.technical_skills && (
            <div className="skill-category">
              <h4>Technical Skills</h4>
              {matching_skills.technical_skills.length > 0 ? (
                <ul className="skills-list matching">
                  {matching_skills.technical_skills.map((skill, index) => (
                    <li key={index} className="skill-item match">
                      <span className="skill-name">{skill}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-data">No matching technical skills found.</p>
              )}
            </div>
          )}

          {/* Soft Skills */}
          {matching_skills && matching_skills.soft_skills && (
            <div className="skill-category">
              <h4>Soft Skills</h4>
              {matching_skills.soft_skills.length > 0 ? (
                <ul className="skills-list matching">
                  {matching_skills.soft_skills.map((skill, index) => (
                    <li key={index} className="skill-item match">
                      <span className="skill-name">{skill}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-data">No matching soft skills found.</p>
              )}
            </div>
          )}
        </div>

        {/* Missing Skills */}
        <div className="result-section">
          <h3>Missing Skills</h3>

          {/* Critical Skills */}
          {missing_skills && missing_skills.critical && (
            <div className="skill-category">
              <h4>Critical Skills</h4>
              {missing_skills.critical.length > 0 ? (
                <ul className="skills-list missing">
                  {missing_skills.critical.map((skill, index) => (
                    <li key={index} className="skill-item missing-critical">
                      <span className="skill-name">{skill}</span>
                      <span className="skill-importance">Critical</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-data">No critical skill gaps identified.</p>
              )}
            </div>
          )}

          {/* Preferred Skills */}
          {missing_skills && missing_skills.preferred && (
            <div className="skill-category">
              <h4>Preferred Skills</h4>
              {missing_skills.preferred.length > 0 ? (
                <ul className="skills-list missing">
                  {missing_skills.preferred.map((skill, index) => (
                    <li key={index} className="skill-item missing-preferred">
                      <span className="skill-name">{skill}</span>
                      <span className="skill-importance">Preferred</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-data">No preferred skill gaps identified.</p>
              )}
            </div>
          )}

          {/* Experience Gaps */}
          {missing_skills && missing_skills.experience_gaps && (
            <div className="skill-category">
              <h4>Experience Gaps</h4>
              {missing_skills.experience_gaps.length > 0 ? (
                <ul className="skills-list missing">
                  {missing_skills.experience_gaps.map((gap, index) => (
                    <li key={index} className="skill-item missing-experience">
                      <span className="skill-name">{gap}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-data">No significant experience gaps identified.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Strengths Section */}
      {analysis && analysis.strengths && (
        <div className="strengths-section result-section">
          <h3>Key Strengths</h3>
          {analysis.strengths.length > 0 ? (
            <ul className="strengths-list">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="strength-item">
                  <span className="strength-icon">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-data">No key strengths identified.</p>
          )}
        </div>
      )}

      {/* Recommendations */}
      {analysis && analysis.recommendations && (
        <div className="recommendation-section result-section">
          <h3>Recommendations</h3>
          {analysis.recommendations.length > 0 ? (
            <ul className="recommendations-list">
              {analysis.recommendations.map((recommendation, index) => (
                <li key={index} className="recommendation-item">
                  <span className="recommendation-icon">💡</span>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-data">No recommendations available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;