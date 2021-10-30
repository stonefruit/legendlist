import { Task } from '../types'
import { classNames } from '../utils'

type Props = {
  task: Task
  updateTask({
    id,
    actualEndDate,
  }: {
    id: string
    actualEndDate: number | null
  }): Promise<void>
  activeTaskId: string | null
  selectActiveTask(id: string | null): void
}
export default function TaskListItem({
  task,
  updateTask,
  activeTaskId,
  selectActiveTask,
}: Props) {
  const onChangeDone = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.checked) {
      await updateTask({ id: task.id, actualEndDate: Date.now() })
    } else {
      await updateTask({ id: task.id, actualEndDate: null })
    }
  }

  const onClickTask = (id: string) => () => {
    if (activeTaskId === id) {
      selectActiveTask(null)
    } else {
      selectActiveTask(id)
    }
  }

  const isActive = activeTaskId === task.id

  return (
    <div
      className={classNames(
        isActive ? 'bg-yellow-200' : 'hover:bg-yellow-100',
        'flex px-5 py-3 cursor-pointer border-b'
      )}
      onClick={onClickTask(task.id)}
    >
      <div className="flex items-center h-5">
        <input
          onChange={onChangeDone}
          checked={!!task.actualEndDate}
          id="done"
          name="done"
          type="checkbox"
          className="focus:ring-yellow-500 hover:bg-yellow-200 h-4 w-4 text-yellow-600 border-gray-300 rounded cursor-pointer"
        />
      </div>
      <div className={'ml-3 text-sm w-full'}>
        <label htmlFor="done" className="font-medium text-gray-700">
          {task.name}
        </label>
        <p id="comments-description" className="text-gray-400 text-xs">
          {task.actualEndDate}
        </p>
      </div>
    </div>
  )
}
