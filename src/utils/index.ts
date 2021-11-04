import { Task } from '../types'

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ')
}

const taskSorter = (
  tasks: Task[],
  attribute: string,
  direction: 'DSC' | 'ASC'
): Task[] => {
  const sorter = (taskA: Task, taskB: Task) => {
    const valA = (taskA as any)[attribute]
    const valB = (taskB as any)[attribute]
    if (valA < valB) {
      return direction === 'DSC' ? 1 : -1
    } else if (valA > valB) {
      return direction === 'DSC' ? -1 : 1
    } else {
      return 0
    }
  }
  return tasks.sort(sorter)
}

const delay = (milliseconds: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), milliseconds)
  })
}

export { taskSorter, classNames, delay }
