import { useState } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Calendar } from 'lucide-react'
import { format } from 'date-fns'

const Profile = () => {
  const { user } = useSelector((state) => state.user)
  const [isLoading, setIsLoading] = useState(false)
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return format(new Date(dateString), 'PPP')
    } catch (e) {
      return 'Invalid date'
    }
  }
  
  // Profile sections with user information
  const profileSections = [
    {
      title: 'Personal Information',
      fields: [
        { label: 'Full Name', value: user?.Name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim(), icon: <User size={18} /> },
        { label: 'Email', value: user?.Email || user?.emailAddress, icon: <Mail size={18} /> },
        { label: 'Phone', value: user?.Phone || 'Not provided', icon: <Phone size={18} /> }
      ]
    },
    {
      title: 'Account Information',
      fields: [
        { label: 'Last Login', value: formatDate(user?.LastLoginDate), icon: <Calendar size={18} /> },
        { label: 'Account Created', value: formatDate(user?.CreatedOn), icon: <Calendar size={18} /> }
      ]
    }
  ]
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
          <p className="text-surface-600 dark:text-surface-400">
            Manage your account information
          </p>
        </header>
        
        <div className="space-y-6">
          {profileSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="card-neu p-6"
            >
              <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
              
              <div className="space-y-4">
                {section.fields.map((field) => (
                  <div key={field.label} className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary bg-opacity-10 rounded-full flex items-center justify-center text-primary">
                      {field.icon}
                    </span>
                    <div>
                      <p className="text-sm text-surface-500 dark:text-surface-400">
                        {field.label}
                      </p>
                      <p className="font-medium">{field.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Profile