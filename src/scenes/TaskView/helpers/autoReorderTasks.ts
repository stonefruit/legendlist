import { Task } from '../../../types'
import { taskSorter } from './utils/taskSorter'
import * as models from '../../../models'

/**
 * Check for order clashes. Also assigns order number based on positioning in array
 */
export const checkForOrderChange = (_dbTasks: Task[]) => {
  const dbTasks = taskSorter(_dbTasks, 'orderInFolder', 'ASC')
  const desiredTasks: Task[] = []
  let tasksWithSameOrder: Task[] = []
  for (let i = 0; i < dbTasks.length; i += 1) {
    const currentTask = dbTasks[i]
    const nextTask = dbTasks[i + 1]
    tasksWithSameOrder.push(currentTask)
    if (nextTask?.orderInFolder !== currentTask.orderInFolder) {
      tasksWithSameOrder = taskSorter(tasksWithSameOrder, 'createdAt', 'DSC')
      tasksWithSameOrder.forEach((task) => desiredTasks.push(task))
      tasksWithSameOrder = []
    }
  }
  const orderedTasks = desiredTasks.map((task, index) => {
    task.orderInFolder = index
    return task
  })
  return orderedTasks
}

export const autoReorderTasks = async (folderId: string) => {
  const dbTasks = await models.Task.find({ folderId })
  let orderedTasks = checkForOrderChange(dbTasks)
  const tasksWithCorrectOrder = orderedTasks.map((task, index) => {
    task.orderInFolder = index
    return task
  })
  await models.Task.bulkPut(tasksWithCorrectOrder)
  return orderedTasks
}
