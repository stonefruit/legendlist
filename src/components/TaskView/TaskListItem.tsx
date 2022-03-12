// TODO: Add state testing
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MenuIcon,
  TrashIcon,
} from '@heroicons/react/outline'
import { FolderIcon } from '@heroicons/react/solid'
import { Task, UpdateTask } from '../../types'
import { classNames } from '../../utils'

type Props = {
  task: Task
  updateTask?: UpdateTask
  deleteTask?: (id: string) => void
  activeTaskId: string | null
  selectActiveTask: (id: string | null) => void
  moveTask?: (taskId: string, direction: 'UP' | 'DOWN') => void
  isTopOfList?: boolean
  isBottomOfList?: boolean
}
export default function TaskListItem({
  task,
  updateTask,
  deleteTask,
  activeTaskId,
  selectActiveTask,
  moveTask,
  isTopOfList,
  isBottomOfList,
}: Props) {
  // Note that name is used so that the react controlled input acts more normally.
  // If async function is used, cursor jumps to end of the word.
  // This still happens if you type very fast.
  const [name, setName] = useState('')
  const isActive = activeTaskId === task.id
  const hasFiles = task.filePaths ? task.filePaths.length > 0 : false

  // FUNCTIONS

  const onChangeDone = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!updateTask) {
      return
    }
    e.preventDefault()
    if (e.target.checked) {
      updateTask({ id: task.id, actualEndDate: Date.now() })
    } else {
      updateTask({ id: task.id, actualEndDate: null })
    }
  }

  const onClickTask = (id: string) => () => {
    selectActiveTask(id)
  }

  const onChangeName = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!updateTask) {
      return
    }
    setName(e.target.value)
    updateTask({ id: task.id, name: e.target.value })
  }

  // EFFECTS

  useEffect(() => {
    setName(task.name)
  }, [task.name])

  // SUB COMPONENTS

  const MoveUpAndDown = () => {
    return (
      <div
        className={classNames(
          !task.actualEndDate ? '' : 'invisible',
          'flex flex-col'
        )}
      >
        {isActive && moveTask && (
          <>
            <ChevronUpIcon
              height={15}
              className={classNames(
                !isActive || isTopOfList ? 'invisible' : '',
                'text-gray-300 hover:text-gray-800'
              )}
              onClick={() => {
                if (!moveTask) {
                  return
                }
                moveTask(task.id, 'UP')
              }}
            />
            <ChevronDownIcon
              height={15}
              className={classNames(
                !isActive || isBottomOfList ? 'invisible' : '',
                'text-gray-300 hover:text-gray-800'
              )}
              onClick={() => {
                if (!moveTask) {
                  return
                }
                moveTask(task.id, 'DOWN')
              }}
            />
          </>
        )}
        {!isActive && updateTask && (
          <MenuIcon height={15} className="text-gray-300 hover:text-gray-800" />
        )}
      </div>
    )
  }

  const CompleteCheckbox = () => {
    return (
      <div className="flex items-center h-8 pl-3">
        <input
          onClick={(e) => e.stopPropagation()}
          onChange={onChangeDone}
          checked={!!task.actualEndDate}
          id={task.id}
          name="done"
          type="checkbox"
          className="focus:ring-yellow-500 hover:bg-yellow-200 h-4 w-4 text-yellow-600 border-gray-300 rounded cursor-pointer"
        />
      </div>
    )
  }

  const DeleteButton = () => {
    return (
      <div className="flex flex-row items-center justify-center">
        <TrashIcon
          height={15}
          className={classNames(
            isActive ? '' : 'invisible',
            'text-gray-300 hover:text-gray-800'
          )}
          onClick={() => {
            if (!deleteTask) {
              return
            }
            deleteTask(task.id)
          }}
        />
      </div>
    )
  }

  const HasFilesIcon = () => {
    return (
      <div className="flex flex-row items-center mr-2">
        <FolderIcon height={15} className={classNames('text-gray-400')} />
      </div>
    )
  }

  const StartEndDates = () => {
    return (
      <div className="flex text-xs text-gray-500">
        {task.plannedStartDate && (
          <div>{format(task.plannedStartDate, 'dd MMM yyyy')}&nbsp;-&nbsp;</div>
        )}
        {task.plannedEndDate && (
          <div>{format(task.plannedEndDate, 'dd MMM yyyy')}</div>
        )}
      </div>
    )
  }

  return (
    <div
      className={classNames(
        isActive ? 'bg-yellow-200' : 'hover:bg-yellow-100',
        'flex px-3 py-3 cursor-pointer border-b group items-center'
      )}
      onClick={onClickTask(task.id)}
    >
      {moveTask && <MoveUpAndDown />}
      {updateTask && <CompleteCheckbox />}
      <div className={'ml-3 text-sm w-full'}>
        <input
          disabled={!isActive || !updateTask}
          type="text"
          className={classNames(
            isActive
              ? 'bg-yellow-200 group-hover:bg-yellow-200'
              : 'group-hover:bg-yellow-100',
            isActive && updateTask ? 'cursor-text' : 'cursor-pointer',
            'placeholder-gray-400 pr-6 break-words border-0 bg-yellow-50 p-0 m-0 focus:ring-transparent w-full resize-none outline-none font-medium text-gray-700'
          )}
          placeholder="What would you like to call this item?"
          onChange={onChangeName}
          value={name}
        />
        <div className="flex ">
          {hasFiles && <HasFilesIcon />}
          <StartEndDates />
        </div>
      </div>
      {deleteTask && <DeleteButton />}
    </div>
  )
}
