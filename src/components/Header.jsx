import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sun, Moon, User, LogOut } from 'lucide-react'
import { clearUser } from '../store/userSlice'
import { logout } from '../services/authService'

const Header = ({ darkMode, setDarkMode }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector((state) => state.user)

  const handleLogout = async () => {
    await logout()
    dispatch(clearUser())
    navigate('/login')
  }

  const navigateToProfile = () => {
    navigate('/profile')
  }

  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-surface-800/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-700">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <motion.div 
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            className="text-primary font-bold text-2xl cursor-pointer"
            onClick={() => navigate('/')}
          >
            TaskFlow
          </motion.div>
        </div>
        
        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <>
              <div className="mr-4 text-sm hidden md:block">
                Hello, <span className="font-medium">{user?.firstName || user?.Name || 'User'}</span>
              </div>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={navigateToProfile}
                className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                aria-label="User profile"
              >
                <User size={20} />
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                aria-label="Log out"
              >
                <LogOut size={20} />
              </motion.button>
            </>
          )}
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
        </div>
      </div>
    </header>
  )
}

export default Header