/**
 * ApperService - Core service for Apper backend interactions
 * Manages ApperClient instance and common operations
 */

// Apper SDK Canvas ID for this application
export const CANVAS_ID = '67a0da368a1f4a748beca0578b5321ef'

// Get ApperClient instance with proper initialization
export const getApperClient = () => {
  const { ApperClient } = window.ApperSDK
  return new ApperClient(CANVAS_ID)
}

// Get ApperUI for authentication components
export const getApperUI = () => {
  const { ApperUI } = window.ApperSDK
  return ApperUI
}

// Utility function for handling API errors
export const handleApiError = (error) => {
  console.error('API Error:', error)
  
  // Return standardized error object
  return {
    message: error.message || 'An unexpected error occurred',
    status: error.status || 500,
    details: error.details || {}
  }
}