import _ from 'lodash'
import { Task } from '../../../types'
import { taskSorter } from './utils/taskSorter'
import * as models from '../../../models'

// TODO: add tests
export const checkForChange = (dbTasks: Task[]) => {
  let hasChange = false
  let prevOrder: null | number = null
  const desiredTasks: Task[] = []
  let tasksWithSameOrder: Task[] = []
  for (let i = 0; i < dbTasks.length; i += 1) {
    const currentTask = dbTasks[i]
    // Initial setup with first value
    if (prevOrder === null) {
      prevOrder = currentTask.orderInFolder
      tasksWithSameOrder.push(currentTask)
      continue
    }
    if (prevOrder !== currentTask.orderInFolder) {
      tasksWithSameOrder = taskSorter(tasksWithSameOrder, 'createdAt', 'DSC')
      tasksWithSameOrder.forEach((task) => desiredTasks.push(task))
      tasksWithSameOrder = []
    }
    tasksWithSameOrder.push(currentTask)
    prevOrder = currentTask.orderInFolder
  }
  // Handle last group of tasks after loop ends
  tasksWithSameOrder.forEach((task) => desiredTasks.push(task))

  const orderedTasks = desiredTasks.map((task, index) => {
    if (!hasChange && dbTasks[index].orderInFolder !== index) {
      hasChange = true
    }
    task.orderInFolder = index
    return task
  })
  return { hasChange, orderedTasks }
}

export const autoReorderTasks = async (
  _dbTasks: Task[],
  selectedNavId: string
) => {
  const dbTasks = taskSorter(_.cloneDeep(_dbTasks), 'orderInFolder', 'ASC')

  let { hasChange, orderedTasks } = checkForChange(dbTasks)

  if (hasChange) {
    const tasksToUpdate = orderedTasks.map((task, index) => {
      task.orderInFolder = index
      return task
    })
    await models.Task.bulkPut(tasksToUpdate)
    return await models.Task.find({ folderId: selectedNavId })
  }
  return dbTasks
}
