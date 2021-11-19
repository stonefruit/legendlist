import { Task } from '../../../types'
import { taskSorter } from '.'

export function prepareTasksToUpdate(
  dbTasks: Task[],
  taskId: string,
  beforeTaskId: string | null
) {
  const sortedDbTasks = taskSorter(dbTasks, 'orderInFolder', 'ASC')

  const currentTaskIndex = sortedDbTasks.findIndex((task) => task.id === taskId)
  const beforeTaskIndex = sortedDbTasks.findIndex(
    (task) => task.id === beforeTaskId
  )
  let newTaskIndex: number
  if (beforeTaskIndex > -1) {
    sortedDbTasks.splice(beforeTaskIndex, 0, sortedDbTasks[currentTaskIndex])
    newTaskIndex = beforeTaskIndex
  } else {
    sortedDbTasks.splice(
      sortedDbTasks.length,
      0,
      sortedDbTasks[currentTaskIndex]
    )
    newTaskIndex = sortedDbTasks.length
  }
  const taskToRemoveIndex = sortedDbTasks.findIndex(
    (task, index) => task.id === taskId && newTaskIndex !== index
  )
  sortedDbTasks.splice(taskToRemoveIndex, 1)

  const tasksToUpdate = sortedDbTasks.map((task, index) => {
    task.orderInFolder = index
    return task
  })
  return tasksToUpdate
}
