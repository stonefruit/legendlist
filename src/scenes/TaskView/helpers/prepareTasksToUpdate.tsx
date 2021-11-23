import { Task } from '../../../types'
import { taskSorter } from '.'

export function prepareTasksToUpdate(
  tasks: Task[],
  taskToMoveId: string,
  direction: 'UP' | 'DOWN'
) {
  if (tasks.length === 0) {
    return []
  }
  const sortedTasks = taskSorter(tasks, 'orderInFolder', 'ASC')
  let moveToBeforeTaskId: string | null = null
  let isTaskMovingToLast = false
  const currentTaskIndex = sortedTasks.findIndex(
    (task) => task.id === taskToMoveId
  )
  const currentTask = sortedTasks[currentTaskIndex]
  if (direction === 'UP' && currentTaskIndex !== 0) {
    moveToBeforeTaskId = sortedTasks[currentTaskIndex - 1]?.id
  }
  if (direction === 'DOWN' && currentTaskIndex !== sortedTasks.length - 1) {
    isTaskMovingToLast = currentTaskIndex + 1 === sortedTasks.length - 1
    if (!isTaskMovingToLast) {
      moveToBeforeTaskId = sortedTasks[currentTaskIndex + 2]?.id
    }
  }

  if (!moveToBeforeTaskId && !isTaskMovingToLast) {
    return sortedTasks
  }

  sortedTasks.splice(currentTaskIndex, 1)

  const beforeTaskIndex = sortedTasks.findIndex(
    (task) => task.id === moveToBeforeTaskId
  )
  if (!isTaskMovingToLast && beforeTaskIndex > -1) {
    sortedTasks.splice(beforeTaskIndex, 0, currentTask)
  } else {
    sortedTasks.splice(sortedTasks.length, 0, currentTask)
  }

  const tasksToUpdate = sortedTasks.map((task, index) => {
    task.orderInFolder = index
    return task
  })

  return tasksToUpdate
}
