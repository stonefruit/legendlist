import { Task } from '../../../../types'
import { prepareTasksToUpdate } from '../prepareTasksToUpdate'

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
    expect(prepareTasksToUpdate(tasks, '', 'UP')).toStrictEqual([])
  })
  test('when there are no tasks1', () => {
    const tasks: Task[] = [{ ...sampleTask }]
    expect(prepareTasksToUpdate(tasks, '', 'UP')).toStrictEqual([
      { ...sampleTask },
    ])
  })
  test('when there are no tasks2', () => {
    const tasks: Task[] = [
      { ...sampleTask, id: '1', orderInFolder: 0 },
      { ...sampleTask, id: '2', orderInFolder: 1 },
    ]
    const expected: Task[] = [
      { ...sampleTask, id: '2', orderInFolder: 0 },
      { ...sampleTask, id: '1', orderInFolder: 1 },
    ]
    expect(prepareTasksToUpdate(tasks, '1', 'UP')).toStrictEqual(tasks)
    expect(prepareTasksToUpdate(tasks, '1', 'DOWN')).toStrictEqual(expected)
  })
  test('when there are no tasks 3', () => {
    const tasks: Task[] = [
      { ...sampleTask, id: '1', orderInFolder: 0 },
      { ...sampleTask, id: '2', orderInFolder: 1 },
      { ...sampleTask, id: '3', orderInFolder: 2 },
    ]
    const expected: Task[] = [
      { ...sampleTask, id: '2', orderInFolder: 0 },
      { ...sampleTask, id: '1', orderInFolder: 1 },
      { ...sampleTask, id: '3', orderInFolder: 2 },
    ]
    expect(prepareTasksToUpdate(tasks, '1', 'UP')).toStrictEqual(tasks)
    expect(prepareTasksToUpdate(tasks, '1', 'DOWN')).toStrictEqual(expected)
  })
  test('when there are no tasks 3a', () => {
    const tasks: Task[] = [
      { ...sampleTask, id: '2', orderInFolder: 0 },
      { ...sampleTask, id: '1', orderInFolder: 1 },
      { ...sampleTask, id: '3', orderInFolder: 2 },
    ]
    const expected1: Task[] = [
      { ...sampleTask, id: '1', orderInFolder: 0 },
      { ...sampleTask, id: '2', orderInFolder: 1 },
      { ...sampleTask, id: '3', orderInFolder: 2 },
    ]
    const expected2: Task[] = [
      { ...sampleTask, id: '2', orderInFolder: 0 },
      { ...sampleTask, id: '3', orderInFolder: 1 },
      { ...sampleTask, id: '1', orderInFolder: 2 },
    ]
    expect(prepareTasksToUpdate(tasks, '1', 'UP')).toStrictEqual(expected1)
    expect(prepareTasksToUpdate(tasks, '1', 'DOWN')).toStrictEqual(expected2)
  })
  test('when there are no tasks 4', () => {
    const tasks: Task[] = [
      { ...sampleTask, id: '1', orderInFolder: 0 },
      { ...sampleTask, id: '2', orderInFolder: 1 },
      { ...sampleTask, id: '3', orderInFolder: 2 },
    ]
    const expected: Task[] = [
      { ...sampleTask, id: '1', orderInFolder: 0 },
      { ...sampleTask, id: '3', orderInFolder: 1 },
      { ...sampleTask, id: '2', orderInFolder: 2 },
    ]
    expect(prepareTasksToUpdate(tasks, '3', 'UP')).toStrictEqual(expected)
    expect(prepareTasksToUpdate(tasks, '3', 'DOWN')).toStrictEqual(tasks)
  })
  test('when there are no tasks 5', () => {
    const tasks: Task[] = [
      { ...sampleTask, id: '1', orderInFolder: 0 },
      { ...sampleTask, id: '2', orderInFolder: 1 },
      { ...sampleTask, id: '3', orderInFolder: 2 },
    ]
    const expected1: Task[] = [
      { ...sampleTask, id: '2', orderInFolder: 0 },
      { ...sampleTask, id: '1', orderInFolder: 1 },
      { ...sampleTask, id: '3', orderInFolder: 2 },
    ]
    const expected2: Task[] = [
      { ...sampleTask, id: '1', orderInFolder: 0 },
      { ...sampleTask, id: '3', orderInFolder: 1 },
      { ...sampleTask, id: '2', orderInFolder: 2 },
    ]
    expect(prepareTasksToUpdate(tasks, '2', 'UP')).toStrictEqual(expected1)
    expect(prepareTasksToUpdate(tasks, '2', 'DOWN')).toStrictEqual(expected2)
  })
})
