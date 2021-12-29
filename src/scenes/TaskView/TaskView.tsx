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
import {
  NavigationItem,
  Task,
  TaskCreateAttributes,
  UpdateTaskParams,
} from '../../types'
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

  const isNext3DaysFilter = navigator.id === 'NEXT_3_DAYS'
  const sortedTasks = isNext3DaysFilter
    ? taskSorter(tasks, 'plannedEndDate', 'ASC')
    : taskSorter(tasks, 'orderInFolder', 'ASC').filter(
        (task) => task.folderId === navigator.id
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

  const refreshTasks = () => {
    if (isNext3DaysFilter) {
      models.Task.findNext3Days().then((todayTasks) => {
        setTasks(todayTasks)
      })
    } else {
      autoReorderTasks(folderId).then((updatedTasks) => {
        const wasActiveTaskRemoved =
          updatedTasks.findIndex((task) => task.id === activeTaskId) === -1
        if (wasActiveTaskRemoved) {
          setActiveTaskId(null)
        }
        setTasks(updatedTasks)
      })
    }
  }

  const addTask = ({ name }: TaskCreateAttributes) => {
    const newTaskId = uuidv4()
    models.Task.create({
      id: newTaskId,
      name,
      folderId,
      orderInFolder: 0,
      content: [],
      priority: 0,
      actualEndDate: null,
      actualStartDate: null,
      plannedEndDate: null,
      plannedStartDate: null,
      filePaths: [],
    })
    refreshTasks()
    setActiveTaskId(newTaskId)
  }

  const moveTask = async (taskIdToMove: string, direction: 'UP' | 'DOWN') => {
    const dbTasks = await models.Task.find({ folderId })
    const dbUncompletedTasks = dbTasks.filter((task) => !task.actualEndDate)
    const tasksToUpdate = prepareTasksToUpdate(
      dbUncompletedTasks,
      taskIdToMove,
      direction
    )

    await models.Task.bulkPut(tasksToUpdate)
    refreshTasks()
  }

  const updateTask = async ({
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
    const shouldBringTaskToTop =
      !isNext3DaysFilter &&
      ((isMovingFolder && !actualEndDate) || isSettingToUncompleted)

    await models.Task.update({
      id,
      actualEndDate,
      name,
      folderId: newFolderId,
      orderInFolder: shouldBringTaskToTop ? -1 : undefined,
      filePaths,
      content,
      plannedEndDate,
      plannedStartDate,
    })
    const updatedTask = await models.Task.get({ id })
    const taskStillInFolder = updatedTask && updatedTask.folderId === folderId
    const setToUncompletedOrOtherValueChanged = !actualEndDate

    if (!setToUncompletedOrOtherValueChanged) {
      setActiveTaskId(null)
    } else if (isNext3DaysFilter) {
      //
    } else if (!(updatedTask && taskStillInFolder)) {
      setActiveTaskId(null)
    }
    refreshTasks()
  }

  const deleteTask = (id: string) => {
    const _tasks = _.cloneDeep(tasks)
    const updatedTasks = _tasks.filter((task) => task.id !== id)
    setTasks(updatedTasks)
    if (activeTaskId === id) {
      setActiveTaskId(null)
    }
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
    refreshTasks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderId])

  useEffect(() => {
    const runAsync = async () => {
      refreshTasks()
    }
    runAsync()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    const runAsync = async () => {
      if (activeTaskId === null) {
        setActiveTaskId(null)
        return
      }
      const updatedTask = await models.Task.get({ id: activeTaskId })
      if (!updatedTask) {
        setActiveTaskId(null)
        return
      }
      setActiveTaskId(updatedTask.id)
    }
    runAsync()
  }, [activeTaskId])

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
              {navigator.name}
            </h1>
            {!(ReservedNavIds as any)[navigator.id] && (
              <ConfirmNavDeleteWidget
                trashState={trashState}
                setTrashState={setTrashState}
                onClickDeleteFolder={onClickDeleteFolder}
                selectedNavId={folderId}
              />
            )}
          </div>
          {!isNext3DaysFilter && <AddTaskBar addTask={addTask} />}
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
                          isDragDisabled={isNext3DaysFilter}
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
                                  isNext3DaysFilter ? undefined : moveTask
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
