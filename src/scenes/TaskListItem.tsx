import { Task } from '../types'

type Props = {
  task: Task
}
export default function TaskListItem({ task }: Props) {
  return (
    <div className="flex">
      <div className="flex items-center h-5">
        <input
          id="done"
          name="done"
          type="checkbox"
          className="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300 rounded"
        />
      </div>
      <div className="ml-3 text-sm w-full">
        <label htmlFor="done" className="font-medium text-gray-700">
          {task.name}
        </label>
        <p id="comments-description" className="text-gray-400 text-xs">
          {task.id}
        </p>
        <div className="w-full border-t mt-2 mb-3" />
      </div>
    </div>
  )
}
