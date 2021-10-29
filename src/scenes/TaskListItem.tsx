import { Task } from '../types'

type Props = {
  task: Task
  updateTask({}): Promise<void>
}
export default function TaskListItem({ task, updateTask }: Props) {
  const onChangeDone = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.checked) {
      await updateTask({ id: task.id, actualEndDate: Date.now() })
    } else {
      await updateTask({ id: task.id, actualEndDate: null })
    }
  }
  return (
    <div className="flex">
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
      <div className="ml-3 text-sm w-full">
        <label htmlFor="done" className="font-medium text-gray-700">
          {task.name}
        </label>
        <p id="comments-description" className="text-gray-400 text-xs">
          {task.actualEndDate}
        </p>
        <div className="w-full border-t mt-2 mb-3" />
      </div>
    </div>
  )
}
