import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Calendar, 
  Clock, 
  Flag, 
  Check, 
  Trash2, 
  Edit, 
  X, 
  ChevronDown,
  AlertCircle
} from 'lucide-react'

// Priority options with their colors
const PRIORITIES = {
  low: { label: "Low", color: "bg-green-500", icon: <Flag size={16} className="text-green-500" /> },
  medium: { label: "Medium", color: "bg-yellow-500", icon: <Flag size={16} className="text-yellow-500" /> },
  high: { label: "High", color: "bg-red-500", icon: <Flag size={16} className="text-red-500" /> }
}

// Status options
const STATUSES = {
  pending: { label: "Pending", color: "bg-yellow-500" },
  "in-progress": { label: "In Progress", color: "bg-blue-500" },
  completed: { label: "Completed", color: "bg-green-500" }
}

const MainFeature = () => {
  // State for tasks
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks')
    return savedTasks ? JSON.parse(savedTasks) : []
  })
  
  // State for form
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'pending'
  })
  
  // State for form validation
  const [errors, setErrors] = useState({})
  
  // State for edit mode
  const [editingTaskId, setEditingTaskId] = useState(null)
  
  // State for filter
  const [filter, setFilter] = useState({
    status: 'all',
    priority: 'all',
    search: ''
  })
  
  // State for dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false)
  
  // Save tasks to localStorage when they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }
  
  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }
    
    if (formData.dueDate && new Date(formData.dueDate) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.dueDate = "Due date cannot be in the past"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    if (editingTaskId) {
      // Update existing task
      setTasks(tasks.map(task => 
        task.id === editingTaskId 
          ? { ...task, ...formData, updatedAt: new Date().toISOString() }
          : task
      ))
      setEditingTaskId(null)
    } else {
      // Add new task
      const newTask = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setTasks([...tasks, newTask])
    }
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      status: 'pending'
    })
  }
  
  // Start editing a task
  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate || '',
      priority: task.priority,
      status: task.status
    })
    setEditingTaskId(task.id)
    
    // Scroll to form
    document.getElementById('task-form').scrollIntoView({ behavior: 'smooth' })
  }
  
  // Delete a task
  const handleDelete = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
    
    // If deleting the task being edited, clear edit mode
    if (editingTaskId === id) {
      setEditingTaskId(null)
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        status: 'pending'
      })
    }
  }
  
  // Toggle task completion
  const toggleTaskCompletion = (id) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { 
            ...task, 
            status: task.status === 'completed' ? 'pending' : 'completed',
            updatedAt: new Date().toISOString()
          }
        : task
    ))
  }
  
  // Cancel editing
  const cancelEdit = () => {
    setEditingTaskId(null)
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      status: 'pending'
    })
    setErrors({})
  }
  
  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    // Filter by status
    if (filter.status !== 'all' && task.status !== filter.status) {
      return false
    }
    
    // Filter by priority
    if (filter.priority !== 'all' && task.priority !== filter.priority) {
      return false
    }
    
    // Filter by search term
    if (filter.search && !task.title.toLowerCase().includes(filter.search.toLowerCase())) {
      return false
    }
    
    return true
  })
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }
  
  return (
    <div className="space-y-8">
      {/* Task Form */}
      <motion.div 
        id="task-form"
        className="card-neu p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold mb-4">
          {editingTaskId ? 'Edit Task' : 'Create New Task'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`input ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="What needs to be done?"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.title}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="input"
              placeholder="Add details about this task..."
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className={`input pl-10 ${errors.dueDate ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
              </div>
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.dueDate}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="priority" className="block text-sm font-medium mb-1">
                Priority
              </label>
              <div className="relative">
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="input pl-10 appearance-none"
                >
                  {Object.entries(PRIORITIES).map(([value, { label }]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <Flag size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500" />
              </div>
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-1">
                Status
              </label>
              <div className="relative">
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="input pl-10 appearance-none"
                >
                  {Object.entries(STATUSES).map(([value, { label }]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500" />
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 pt-2">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary flex items-center gap-2"
            >
              {editingTaskId ? (
                <>
                  <Edit size={18} />
                  Update Task
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Add Task
                </>
              )}
            </motion.button>
            
            {editingTaskId && (
              <motion.button
                type="button"
                onClick={cancelEdit}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-outline flex items-center gap-2"
              >
                <X size={18} />
                Cancel
              </motion.button>
            )}
          </div>
        </form>
      </motion.div>
      
      {/* Task Filters */}
      <motion.div 
        className="flex flex-wrap gap-4 items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Search tasks..."
            value={filter.search}
            onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
            className="input pl-4 pr-4"
          />
        </div>
        
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="btn btn-outline flex items-center gap-2"
          >
            Filters
            <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-64 bg-white dark:bg-surface-800 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700 z-10"
              >
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                      value={filter.status}
                      onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                      className="input"
                    >
                      <option value="all">All Statuses</option>
                      {Object.entries(STATUSES).map(([value, { label }]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Priority</label>
                    <select
                      value={filter.priority}
                      onChange={(e) => setFilter(prev => ({ ...prev, priority: e.target.value }))}
                      className="input"
                    >
                      <option value="all">All Priorities</option>
                      {Object.entries(PRIORITIES).map(([value, { label }]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      {/* Task List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          Your Tasks
          {filteredTasks.length > 0 && (
            <span className="text-sm font-normal bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 px-2 py-0.5 rounded-full">
              {filteredTasks.length}
            </span>
          )}
        </h2>
        
        {filteredTasks.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="flex justify-center mb-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20 
                }}
                className="w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center"
              >
                <Check size={32} className="text-surface-400" />
              </motion.div>
            </div>
            <h3 className="text-lg font-medium mb-2">No tasks found</h3>
            <p className="text-surface-500 dark:text-surface-400">
              {tasks.length === 0 
                ? "You haven't created any tasks yet. Add your first task above!"
                : "No tasks match your current filters. Try adjusting your search or filters."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`card p-4 ${task.status === 'completed' ? 'border-l-4 border-l-green-500' : task.status === 'in-progress' ? 'border-l-4 border-l-blue-500' : 'border-l-4 border-l-yellow-500'}`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTaskCompletion(task.id)}
                      className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border ${
                        task.status === 'completed'
                          ? 'bg-green-500 border-green-500 flex items-center justify-center'
                          : 'border-surface-300 dark:border-surface-600'
                      }`}
                    >
                      {task.status === 'completed' && (
                        <Check size={12} className="text-white" />
                      )}
                    </button>
                    
                    <div className="flex-grow min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className={`text-lg font-medium ${
                          task.status === 'completed' ? 'line-through text-surface-500 dark:text-surface-400' : ''
                        }`}>
                          {task.title}
                        </h3>
                        
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUSES[task.status].color} bg-opacity-10 text-${STATUSES[task.status].color.split('-')[1]}-700 dark:text-${STATUSES[task.status].color.split('-')[1]}-300`}>
                            {STATUSES[task.status].label}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium">
                            {PRIORITIES[task.priority].icon}
                            {PRIORITIES[task.priority].label}
                          </span>
                        </div>
                      </div>
                      
                      {task.description && (
                        <p className="mt-1 text-surface-600 dark:text-surface-400 text-sm line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center text-xs text-surface-500 dark:text-surface-400">
                          {task.dueDate && (
                            <span className="flex items-center gap-1 mr-3">
                              <Calendar size={14} />
                              {formatDate(task.dueDate)}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {new Date(task.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(task)}
                            className="p-1.5 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                          >
                            <Edit size={16} className="text-surface-600 dark:text-surface-400" />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(task.id)}
                            className="p-1.5 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                          >
                            <Trash2 size={16} className="text-red-500" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default MainFeature