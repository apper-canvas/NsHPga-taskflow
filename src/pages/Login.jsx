import { useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { setUser } from '../store/userSlice'
import { initializeAuthUI, showLoginUI } from '../services/authService'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  
  // Get the page they were trying to access before being redirected to login
  const from = location.state?.from || '/'
  
  useEffect(() => {
    // Initialize ApperUI for authentication
    const authUI = initializeAuthUI({
      target: '#authentication',
      view: 'login',
      onSuccess: (user) => {
        dispatch(setUser(user))
        // Navigate them back to the page they tried to visit or to the home page
        navigate(from, { replace: true })
      },
      onError: (error) => {
        console.error('Authentication error:', error)
      }
    })
    
    // Show login UI
    showLoginUI('#authentication')
    
    // Cleanup function
    return () => {
      // Any cleanup needed for ApperUI
    }
  }, [dispatch, navigate, from])
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-50 dark:bg-surface-900 px-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.h1 
            className="text-3xl font-bold mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Welcome to <span className="text-gradient">TaskFlow</span>
          </motion.h1>
          <motion.p 
            className="text-surface-600 dark:text-surface-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Sign in to manage your tasks and boost productivity
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-surface-800 p-8 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700"
        >
          <div id="authentication" className="min-h-[300px]"></div>
          
          <div className="mt-6 text-center text-sm text-surface-600 dark:text-surface-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login