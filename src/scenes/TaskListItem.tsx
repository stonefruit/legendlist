import { Task } from '../types'
import { classNames } from '../utils'

type Props = {
  task: Task
  updateTask({
    id,
    actualEndDate,
    name,
  }: {
    id: string
    actualEndDate?: number | null
    name?: string
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
    selectActiveTask(id)
  }

  const onChangeName = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await updateTask({ id: task.id, name: e.target.value })
  }

  const isActive = activeTaskId === task.id

  return (
    <div
      className={classNames(
        isActive ? 'bg-yellow-200' : 'hover:bg-yellow-100',
        'flex px-5 py-3 cursor-pointer border-b group items-center'
      )}
      onClick={onClickTask(task.id)}
    >
      <div className="flex items-center h-5">
        <input
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
            ' placeholder-gray-400 pr-6 break-words border-0 bg-yellow-50 p-0 m-0 focus:ring-transparent w-full resize-none outline-none font-medium text-gray-700'
          )}
          placeholder="What would you like to call this item?"
          onChange={onChangeName}
          value={task.name}
        />
        <p id="comments-description" className="text-gray-400 text-xs">
          {task.actualEndDate}
        </p>
      </div>
    </div>
  )
}
