import { useEffect, useState } from 'react'
import _ from 'lodash'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd'
import { v4 as uuidv4 } from 'uuid'
import * as models from '../../models'
import { NavigationItem, Task, UpdateTaskParams } from '../../types'
import NoteView from '../NoteView'
import AddTaskBar from './AddTaskBar'
import ConfirmNavDeleteWidget from './ConfirmNavDeleteWidget'
import TaskListItem from './TaskListItem'
import CompletedTasks from './CompletedTasks'
import { autoReorderTasks, taskSorter, prepareTasksToUpdate } from './helpers'

const ReservedNavIds = {
  INBOX: 'INBOX',
  HOME: 'HOME',
  COMPLETED: 'COMPLETED',
  NEXT_3_DAYS: 'NEXT_3_DAYS',
}

type TrashState = 'INACTIVE' | 'ACTIVE' | 'CONFIRM'

type Props = {
  navigator: NavigationItem
  selectedNavId: string
  onClickDeleteFolder(id: string): Promise<void>
  navigation: NavigationItem[]
}
export default function TaskView({
  navigator,
  selectedNavId: folderId,
  onClickDeleteFolder,
  navigation,
}: Props) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [trashState, setTrashState] = useState<TrashState>('INACTIVE')
  const [totalTasks, setTotalTasks] = useState(0)
  const [showCompleted, setShowCompleted] = useState(false)
  const [delayedIsNext3DaysFilter, setDelayedIsNext3DaysFilter] = useState(true)
  const [delayedFolderId, setDelayedFolderId] = useState<string>('')
  const [delayedFolderName, setDelayedFolderName] = useState<string>('')

  const isNext3DaysFilter = folderId === 'NEXT_3_DAYS'
  const sortedTasks = isNext3DaysFilter
    ? taskSorter(tasks, 'plannedEndDate', 'ASC')
    : taskSorter(tasks, 'orderInFolder', 'ASC').filter(
        (task) => task.folderId === delayedFolderId
      )
  const activeTask =
    sortedTasks.find((task) => task.id === activeTaskId) || null

  const completedTasks = sortedTasks.filter((task) => task.actualEndDate)
  const uncompletedTasks = sortedTasks.filter((task) => !task.actualEndDate)
  const sortedCompletedTasks = taskSorter(
    completedTasks,
    'actualEndDate',
    'DSC'
  )

  // FUNCTIONS

  const addTask = ({ name }: Task) => {
    const now = Date.now()
    const newTask: Task = {
      id: uuidv4(),
      name,
      folderId,
      orderInFolder: -1,
      content: [],
      priority: 0,
      actualEndDate: null,
      actualStartDate: null,
      plannedEndDate: null,
      plannedStartDate: null,
      filePaths: [],
      createdAt: now,
      modifiedAt: now,
    }
    const updatedTasks = _.cloneDeep(tasks)
    updatedTasks.push(newTask)
    const reorderedTasks = autoReorderTasks(folderId, updatedTasks)
    models.Task.bulkPut(reorderedTasks)
    setTasks(reorderedTasks)
    setActiveTaskId(newTask.id)
  }

  const moveTask = (taskIdToMove: string, direction: 'UP' | 'DOWN') => {
    const tasksToUpdate = prepareTasksToUpdate(
      uncompletedTasks,
      taskIdToMove,
      direction
    )
    const updatedTasks = _.cloneDeep(tasks).map((task) => {
      const taskToUpdate = tasksToUpdate.find((_task) => task.id === _task.id)
      if (taskToUpdate) {
        return taskToUpdate
      } else {
        return task
      }
    })
    setTasks(updatedTasks)
    models.Task.bulkPut(tasksToUpdate)
  }

  const updateTask = ({
    id,
    actualEndDate,
    name,
    folderId: newFolderId,
    filePaths,
    content,
    plannedEndDate,
    plannedStartDate,
  }: UpdateTaskParams) => {
    const isMovingFolder = !!newFolderId
    const isSettingToUncompleted = actualEndDate === null
    const shouldBringTaskToTopOfFolder =
      (isMovingFolder && !actualEndDate) || isSettingToUncompleted

    const taskToUpdateIndex = tasks.findIndex((task) => task.id === id)
    const taskToUpdate = _.cloneDeep(tasks[taskToUpdateIndex])
    const updatedTask: Task = {
      ...taskToUpdate,
      actualEndDate:
        actualEndDate === undefined
          ? taskToUpdate.actualEndDate
          : actualEndDate,
      name: name === undefined ? taskToUpdate.name : name,
      folderId: newFolderId === undefined ? taskToUpdate.folderId : newFolderId,
      orderInFolder: shouldBringTaskToTopOfFolder
        ? -1
        : taskToUpdate.orderInFolder,
      filePaths: filePaths === undefined ? taskToUpdate.filePaths : filePaths,
      content: content === undefined ? taskToUpdate.content : content,
      plannedEndDate:
        plannedEndDate === undefined
          ? taskToUpdate.plannedEndDate
          : plannedEndDate,
      plannedStartDate:
        plannedStartDate === undefined
          ? taskToUpdate.plannedStartDate
          : plannedStartDate,
    }
    models.Task.update(updatedTask)
    const taskStillInFolder = updatedTask.folderId === folderId
    const setToUncompletedOrOtherValueChanged = !actualEndDate

    if (!setToUncompletedOrOtherValueChanged) {
      setActiveTaskId(null)
    }
    const updatedTasks = _.cloneDeep(tasks)
    updatedTasks[taskToUpdateIndex] = updatedTask
    if (isNext3DaysFilter) {
      setTasks(updatedTasks)
    } else {
      if (isMovingFolder) {
        updatedTasks.splice(taskToUpdateIndex, 1)
      }
      if (!taskStillInFolder) {
        setActiveTaskId(null)
      }
      const reorderedTasks = autoReorderTasks(folderId, updatedTasks)
      models.Task.bulkPut(reorderedTasks)

      const wasActiveTaskRemoved =
        reorderedTasks.findIndex((task) => task.id === activeTaskId) === -1
      if (wasActiveTaskRemoved) {
        setActiveTaskId(null)
      }
      setTasks(reorderedTasks)
    }
  }

  const deleteTask = (id: string) => {
    const updatedTasks = _.cloneDeep(tasks).filter((task) => task.id !== id)
    setTasks(updatedTasks)
    setActiveTaskId(null)
    models.Task.destroy({ id })
  }

  const selectActiveTask = (id: string | null) => {
    setActiveTaskId(id)
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const items = _.cloneDeep(uncompletedTasks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    const reorderedItems = items.map((item, index) => {
      item.orderInFolder = index
      return item
    })
    models.Task.bulkPut(reorderedItems)
    const allTasks = [...reorderedItems, ...completedTasks]
    setTasks(allTasks)
  }

  // EFFECTS

  useEffect(() => {
    // Reset state
    setActiveTaskId(null)
    setShowCompleted(false)

    if (isNext3DaysFilter) {
      models.Task.findNext3Days().then((todayTasks) => {
        setTasks(todayTasks)
        setDelayedIsNext3DaysFilter(true)
        setDelayedFolderId(folderId)
        setDelayedFolderName(navigator.name)
      })
    } else {
      models.Task.find({ folderId }).then((tasksToUse) => {
        const reorderedTasks = autoReorderTasks(folderId, tasksToUse)
        models.Task.bulkPut(reorderedTasks)
        setTasks(reorderedTasks)
        setDelayedIsNext3DaysFilter(false)
        setDelayedFolderId(folderId)
        setDelayedFolderName(navigator.name)
      })
    }
  }, [folderId, isNext3DaysFilter, navigator.name])

  useEffect(() => {
    if (sortedTasks.length !== totalTasks) {
      setTotalTasks(sortedTasks.length)
    }
  }, [sortedTasks, totalTasks])

  useEffect(() => {
    if (totalTasks > 0) {
      setTrashState('INACTIVE')
    } else {
      setTrashState('ACTIVE')
    }
  }, [totalTasks])

  useEffect(() => {
    // Only show task as active (show note view) if it is in current folder tasks
    if (!sortedTasks.find((task) => task.id === activeTaskId)) {
      setActiveTaskId(null)
    }
  }, [activeTaskId, sortedTasks])

  useEffect(() => {
    // FIXME: When the last completed task is set to complete, active task is reset to null
    if (sortedCompletedTasks.length === 0) {
      setShowCompleted(false)
    }
  }, [sortedCompletedTasks])

  useEffect(() => {
    if (!showCompleted) {
      setActiveTaskId(null)
    }
  }, [showCompleted])

  return (
    <div className="ml-64 flex flex-row bg-yellow-50 opacity-90">
      <div className="flex flex-col flex-1 h-screen overflow-y-auto">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              {delayedFolderName}
            </h1>
            {!(ReservedNavIds as any)[delayedFolderId] && (
              <ConfirmNavDeleteWidget
                trashState={trashState}
                setTrashState={setTrashState}
                onClickDeleteFolder={onClickDeleteFolder}
                selectedNavId={folderId}
              />
            )}
          </div>
          {!delayedIsNext3DaysFilter && <AddTaskBar addTask={addTask} />}
          <div className="mx-auto">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="tasks">
                {(provided) => (
                  <div className="py-4" ref={provided.innerRef}>
                    {provided.placeholder}
                    {uncompletedTasks.map((task, index) => {
                      return (
                        <Draggable
                          key={task.id}
                          index={index}
                          draggableId={task.id}
                          isDragDisabled={delayedIsNext3DaysFilter}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskListItem
                                key={task.id}
                                task={task}
                                updateTask={updateTask}
                                deleteTask={deleteTask}
                                selectActiveTask={selectActiveTask}
                                activeTaskId={activeTaskId}
                                moveTask={
                                  delayedIsNext3DaysFilter
                                    ? undefined
                                    : moveTask
                                }
                                isTopOfList={index === 0}
                                isBottomOfList={
                                  uncompletedTasks.length - 1 === index
                                }
                              />
                            </div>
                          )}
                        </Draggable>
                      )
                    })}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <CompletedTasks
              showCompleted={showCompleted}
              completedTasks={sortedCompletedTasks}
              setShowCompleted={setShowCompleted}
              updateTask={updateTask}
              deleteTask={deleteTask}
              selectActiveTask={selectActiveTask}
              activeTaskId={activeTaskId}
            />
          </div>
        </div>
      </div>
      <NoteView
        task={activeTask}
        navigation={navigation}
        updateTask={updateTask}
      />
    </div>
  )
}
