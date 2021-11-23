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
  const sortedTasks: Array<Task | undefined> = taskSorter(
    tasks,
    'orderInFolder',
    'ASC'
  )
  const currentTaskIndex = sortedTasks.findIndex(
    (task) => task!.id === taskToMoveId
  )

  const currentTask = sortedTasks[currentTaskIndex]

  const isMoveUp = direction === 'UP'
  const isMoveDown = direction === 'DOWN'
  const isCurrentlyTopOfList = currentTaskIndex !== 0
  const isCurrentlyAboveTheBottomOfList =
    currentTaskIndex !== sortedTasks.length - 1

  const isNextDownLastOnList = currentTaskIndex + 1 === sortedTasks.length - 1
  let isTaskMovingToLast =
    isMoveDown && isCurrentlyAboveTheBottomOfList && isNextDownLastOnList

  let moveToBeforeTaskId: string | null =
    isMoveUp && isCurrentlyTopOfList
      ? sortedTasks[currentTaskIndex - 1]?.id || null
      : isMoveDown && isCurrentlyAboveTheBottomOfList && !isTaskMovingToLast
      ? sortedTasks[currentTaskIndex + 2]?.id || null
      : null

  if (!moveToBeforeTaskId && !isTaskMovingToLast) {
    return sortedTasks as Task[]
  }

  sortedTasks.splice(currentTaskIndex, 1)

  const beforeTaskIndex = sortedTasks.findIndex(
    (task) => task!.id === moveToBeforeTaskId
  )
  if (isTaskMovingToLast) {
    sortedTasks.splice(sortedTasks.length, 0, currentTask)
  } else {
    sortedTasks.splice(beforeTaskIndex, 0, currentTask)
  }

  const tasksToUpdate = sortedTasks.map((task, index) => {
    task!.orderInFolder = index
    return task
  })

  return tasksToUpdate as Task[]
}
