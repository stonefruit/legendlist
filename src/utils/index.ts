import { Task } from '../types'

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const taskSorter = (tasks: Task[]): Task[] => {
  const sorter = (taskA: Task, taskB: Task) => {
    if (taskA.createdAt < taskB.createdAt) {
      return 1
    } else if (taskA.createdAt > taskB.createdAt) {
      return -1
    } else {
      return 0
    }
  }
  return tasks.sort(sorter)
}

export { taskSorter }
