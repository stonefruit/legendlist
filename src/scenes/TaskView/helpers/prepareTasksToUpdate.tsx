import { Task } from '../../../types'
import { taskSorter } from '.'

export function prepareTasksToUpdate(
  tasks: Task[],
  taskToMoveId: string,
  moveToBeforeTaskId: string | null
) {
  const sortedDbTasks = taskSorter(tasks, 'orderInFolder', 'ASC')

  const currentTaskIndex = sortedDbTasks.findIndex(
    (task) => task.id === taskToMoveId
  )
  const beforeTaskIndex = sortedDbTasks.findIndex(
    (task) => task.id === moveToBeforeTaskId
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
    (task, index) => task.id === taskToMoveId && newTaskIndex !== index
  )
  sortedDbTasks.splice(taskToRemoveIndex, 1)

  const tasksToUpdate = sortedDbTasks.map((task, index) => {
    task.orderInFolder = index
    return task
  })
  return tasksToUpdate
}
