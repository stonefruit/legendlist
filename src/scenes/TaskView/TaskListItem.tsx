import {
  ChevronDownIcon,
  ChevronUpIcon,
  TrashIcon,
} from '@heroicons/react/outline'
import { useEffect, useState } from 'react'
import { Task } from '../../types'
import { classNames } from '../../utils'

type Props = {
  task: Task
  updateTask({
    id,
    actualEndDate,
    name,
    folderId,
  }: {
    id: string
    actualEndDate?: number | null
    name?: string
    folderId?: string
  }): Promise<void>
  deleteTask(id: string): Promise<void>
  activeTaskId: string | null
  selectActiveTask(id: string | null): void
  moveTask: (taskId: string, direction: 'UP' | 'DOWN') => Promise<void>
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

  // FUNCTIONS

  const onChangeDone = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.checked) {
      await updateTask({ id: task.id, actualEndDate: Date.now() })
    } else {
      await updateTask({ id: task.id, actualEndDate: null })
    }
  }

  const onClickTask = (id: string) => () => {
    selectActiveTask(id)
  }

  const onChangeName = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    await updateTask({ id: task.id, name: e.target.value })
  }

  // EFFECTS

  useEffect(() => {
    setName(task.name)
  }, [task.name])

  return (
    <div
      className={classNames(
        isActive ? 'bg-yellow-200' : 'hover:bg-yellow-100',
        'flex px-3 py-3 cursor-pointer border-b group items-center'
      )}
      onClick={onClickTask(task.id)}
    >
      <div
        className={classNames(
          isActive && !task.actualEndDate ? '' : 'invisible',
          'flex flex-col'
        )}
      >
        <ChevronUpIcon
          height={15}
          className={classNames(
            isTopOfList ? 'invisible' : '',
            'text-gray-300 hover:text-gray-800'
          )}
          onClick={() => moveTask(task.id, 'UP')}
        />
        <ChevronDownIcon
          height={15}
          className={classNames(
            isBottomOfList ? 'invisible' : '',
            'text-gray-300 hover:text-gray-800'
          )}
          onClick={() => moveTask(task.id, 'DOWN')}
        />
      </div>
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
      <div className={'ml-3 text-sm w-full'}>
        <input
          disabled={!isActive}
          type="text"
          className={classNames(
            isActive
              ? 'bg-yellow-200 group-hover:bg-yellow-200 cursor-text'
              : 'group-hover:bg-yellow-100 cursor-pointer',
            'placeholder-gray-400 pr-6 break-words border-0 bg-yellow-50 p-0 m-0 focus:ring-transparent w-full resize-none outline-none font-medium text-gray-700'
          )}
          placeholder="What would you like to call this item?"
          onChange={onChangeName}
          value={name}
        />
        {/* <p id="comments-description" className="text-gray-400 text-xs">
          {task.orderInFolder}
        </p> */}
      </div>
      <div className="flex flex-row items-center justify-center">
        <TrashIcon
          height={15}
          className={classNames(
            isActive ? '' : 'invisible',
            'text-gray-300 hover:text-gray-800'
          )}
          onClick={() => deleteTask(task.id)}
        />
      </div>
    </div>
  )
}
