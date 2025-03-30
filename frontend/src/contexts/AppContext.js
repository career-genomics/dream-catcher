// src/contexts/AppContext.jsx
// If you're not using useState, remove it from imports
import React, { createContext, useContext, useReducer } from 'react';
// Instead of: import React, { createContext, useContext, useState, useReducer } from 'react';

// Initial state
const initialState = {
  resume: null,
  jobDescription: '',
  results: null,
  isLoading: false,
  error: null,
  matchHistory: [],
  user: null,
};

// Action types
const actionTypes = {
  SET_RESUME: 'SET_RESUME',
  SET_JOB_DESCRIPTION: 'SET_JOB_DESCRIPTION',
  SET_RESULTS: 'SET_RESULTS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  RESET_FORM: 'RESET_FORM',
  SET_MATCH_HISTORY: 'SET_MATCH_HISTORY',
  SET_USER: 'SET_USER',
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_RESUME:
      return { ...state, resume: action.payload };
    case actionTypes.SET_JOB_DESCRIPTION:
      return { ...state, jobDescription: action.payload };
    case actionTypes.SET_RESULTS:
      return { ...state, results: action.payload };
    case actionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload };
    case actionTypes.RESET_FORM:
      return {
        ...state,
        resume: null,
        jobDescription: '',
        results: null,
        error: null
      };
    case actionTypes.SET_MATCH_HISTORY:
      return { ...state, matchHistory: action.payload };
    case actionTypes.SET_USER:
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Action creators
  const setResume = (resume) => {
    dispatch({ type: actionTypes.SET_RESUME, payload: resume });
  };

  const setJobDescription = (jobDescription) => {
    dispatch({ type: actionTypes.SET_JOB_DESCRIPTION, payload: jobDescription });
  };

  const setResults = (results) => {
    dispatch({ type: actionTypes.SET_RESULTS, payload: results });
  };

  const setLoading = (isLoading) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: isLoading });
  };

  const setError = (error) => {
    dispatch({ type: actionTypes.SET_ERROR, payload: error });
  };

  const resetForm = () => {
    dispatch({ type: actionTypes.RESET_FORM });
  };

  const setMatchHistory = (history) => {
    dispatch({ type: actionTypes.SET_MATCH_HISTORY, payload: history });
  };

  const setUser = (user) => {
    dispatch({ type: actionTypes.SET_USER, payload: user });
  };

  // Context value
  const value = {
    state,
    setResume,
    setJobDescription,
    setResults,
    setLoading,
    setError,
    resetForm,
    setMatchHistory,
    setUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};