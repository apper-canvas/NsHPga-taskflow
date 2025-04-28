/**
 * AuthService - Handles authentication-related operations
 */
import { getApperClient, getApperUI, CANVAS_ID } from './apperService'

// Initialize ApperUI authentication component
export const initializeAuthUI = (options) => {
  const { target, view, onSuccess, onError } = options
  
  const apperClient = getApperClient()
  const ApperUI = getApperUI()
  
  ApperUI.setup(apperClient, {
    target,
    clientId: CANVAS_ID,
    view,
    onSuccess,
    onError
  })
  
  return ApperUI
}

// Show login UI
export const showLoginUI = (targetSelector) => {
  const ApperUI = getApperUI()
  ApperUI.showLogin(targetSelector)
}

// Show signup UI
export const showSignupUI = (targetSelector) => {
  const ApperUI = getApperUI()
  ApperUI.showSignup(targetSelector)
}

// Log user out
export const logout = async () => {
  try {
    const apperClient = getApperClient()
    await apperClient.logout()
    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    return { success: false, error }
  }
}