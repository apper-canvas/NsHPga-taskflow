import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { setUser } from '../store/userSlice'
import { initializeAuthUI, showSignupUI } from '../services/authService'

const Signup = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  useEffect(() => {
    // Initialize ApperUI for authentication
    const authUI = initializeAuthUI({
      target: '#authentication',
      view: 'signup',
      onSuccess: (user) => {
        dispatch(setUser(user))
        navigate('/')
      },
      onError: (error) => {
        console.error('Registration error:', error)
      }
    })
    
    // Show signup UI
    showSignupUI('#authentication')
    
    // Cleanup function
    return () => {
      // Any cleanup needed for ApperUI
    }
  }, [dispatch, navigate])
  
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
            Join <span className="text-gradient">TaskFlow</span>
          </motion.h1>
          <motion.p 
            className="text-surface-600 dark:text-surface-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Create an account to start managing your tasks
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-surface-800 p-8 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700"
        >
          <div id="authentication" className="min-h-[400px]"></div>
          
          <div className="mt-6 text-center text-sm text-surface-600 dark:text-surface-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Signup