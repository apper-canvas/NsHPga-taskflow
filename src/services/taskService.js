/**
 * TaskService - Manages task operations with the Apper backend
 */
import { getApperClient, handleApiError } from './apperService'

// Task table name in Apper
const TASK_TABLE = 'task17'

// Get all tasks for current user
export const fetchTasks = async () => {
  try {
    const apperClient = getApperClient()
    
    const params = {
      fields: [
        'Id', 'Name', 'title', 'description', 'dueDate', 
        'priority', 'status', 'CreatedOn', 'ModifiedOn'
      ],
      pagingInfo: { limit: 100, offset: 0 },
      orderBy: [{ field: 'ModifiedOn', direction: 'desc' }]
    }
    
    const response = await apperClient.fetchRecords(TASK_TABLE, params)
    
    // Map response to match the application's task structure
    return response.data.map(task => ({
      id: task.Id.toString(),
      title: task.title || task.Name,
      description: task.description || '',
      dueDate: task.dueDate || '',
      priority: task.priority || 'medium',
      status: task.status || 'pending',
      createdAt: task.CreatedOn,
      updatedAt: task.ModifiedOn || task.CreatedOn
    }))
  } catch (error) {
    throw handleApiError(error)
  }
}

// Create a new task
export const createTask = async (taskData) => {
  try {
    const apperClient = getApperClient()
    
    const params = {
      record: {
        Name: taskData.title,
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate,
        priority: taskData.priority,
        status: taskData.status
      }
    }
    
    const response = await apperClient.createRecord(TASK_TABLE, params)
    
    // Return formatted task
    return {
      id: response.data.Id.toString(),
      title: response.data.title || response.data.Name,
      description: response.data.description || '',
      dueDate: response.data.dueDate || '',
      priority: response.data.priority || 'medium',
      status: response.data.status || 'pending',
      createdAt: response.data.CreatedOn,
      updatedAt: response.data.ModifiedOn || response.data.CreatedOn
    }
  } catch (error) {
    throw handleApiError(error)
  }
}

// Update an existing task
export const updateTask = async (taskId, taskData) => {
  try {
    const apperClient = getApperClient()
    
    const params = {
      record: {
        Name: taskData.title,
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate,
        priority: taskData.priority,
        status: taskData.status
      }
    }
    
    const response = await apperClient.updateRecord(TASK_TABLE, taskId, params)
    
    // Return formatted task
    return {
      id: response.data.Id.toString(),
      title: response.data.title || response.data.Name,
      description: response.data.description || '',
      dueDate: response.data.dueDate || '',
      priority: response.data.priority || 'medium',
      status: response.data.status || 'pending',
      createdAt: response.data.CreatedOn,
      updatedAt: response.data.ModifiedOn || response.data.CreatedOn
    }
  } catch (error) {
    throw handleApiError(error)
  }
}

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    const apperClient = getApperClient()
    await apperClient.deleteRecord(TASK_TABLE, taskId)
    return { success: true, id: taskId }
  } catch (error) {
    throw handleApiError(error)
  }
}