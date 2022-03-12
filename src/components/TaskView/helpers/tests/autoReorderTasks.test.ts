import { Task } from '../../../../types'
import { checkForOrderChange } from '../autoReorderTasks'

const sampleTask: Task = {
  id: 'id',
  folderId: 'folderId',
  orderInFolder: 0,
  name: 'name',
  priority: 1,
  content: [],
  filePaths: [],
  actualEndDate: 123,
  actualStartDate: 123,
  plannedEndDate: 123,
  plannedStartDate: 123,
  createdAt: 123,
  modifiedAt: 123,
}

describe('checkForChange', () => {
  test('when there are no tasks', () => {
    const tasks: Task[] = []
    expect(checkForOrderChange(tasks)).toStrictEqual([])
  })
  test('when there is one task with initial orderInFolder', () => {
    const tasks: Task[] = [
      {
        ...sampleTask,
        orderInFolder: 0,
      },
    ]
    expect(checkForOrderChange(tasks)).toStrictEqual([
      { ...sampleTask, orderInFolder: 0 },
    ])
  })
  test('when there is one task with invalid orderInFolder', () => {
    const tasks: Task[] = [
      {
        ...sampleTask,
        orderInFolder: 1,
      },
    ]
    expect(checkForOrderChange(tasks)).toStrictEqual([
      { ...sampleTask, orderInFolder: 0 },
    ])
  })
  test('when there is 2 tasks with correct orderInFolder', () => {
    const tasks: Task[] = [
      {
        ...sampleTask,
        id: 'test1',
        orderInFolder: 0,
      },
      {
        ...sampleTask,
        id: 'test2',
        orderInFolder: 1,
      },
    ]
    expect(checkForOrderChange(tasks)).toStrictEqual([
      {
        ...sampleTask,
        id: 'test1',
        orderInFolder: 0,
      },
      {
        ...sampleTask,
        id: 'test2',
        orderInFolder: 1,
      },
    ])
  })
  test('when there is 2 tasks with same orderInFolder', () => {
    const tasks: Task[] = [
      {
        ...sampleTask,
        id: 'test2',
        orderInFolder: 0,
        createdAt: 2,
      },
      {
        ...sampleTask,
        id: 'test1',
        orderInFolder: 0,
        createdAt: 1,
      },
    ]
    expect(checkForOrderChange(tasks)).toStrictEqual([
      {
        ...sampleTask,
        id: 'test2',
        orderInFolder: 0,
        createdAt: 2,
      },
      {
        ...sampleTask,
        id: 'test1',
        orderInFolder: 1,
        createdAt: 1,
      },
    ])
  })
  test('when there is 3 tasks with same orderInFolder', () => {
    const tasks: Task[] = [
      {
        ...sampleTask,
        id: 'test2',
        orderInFolder: 0,
        createdAt: 2,
      },
      {
        ...sampleTask,
        id: 'test3',
        orderInFolder: 0,
        createdAt: 3,
      },
      {
        ...sampleTask,
        id: 'test1',
        orderInFolder: 0,
        createdAt: 1,
      },
    ]
    expect(checkForOrderChange(tasks)).toStrictEqual([
      {
        ...sampleTask,
        id: 'test3',
        orderInFolder: 0,
        createdAt: 3,
      },
      {
        ...sampleTask,
        id: 'test2',
        orderInFolder: 1,
        createdAt: 2,
      },
      {
        ...sampleTask,
        id: 'test1',
        orderInFolder: 2,
        createdAt: 1,
      },
    ])
  })
})
