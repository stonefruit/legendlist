// TODO: Add state testing
import { ChevronDownIcon } from '@heroicons/react/outline'
import TaskListItem from './TaskListItem'
import { Task, UpdateTask } from '../../types'

type Props = {
  showCompleted: boolean
  completedTasks: Task[]
  setShowCompleted: React.Dispatch<React.SetStateAction<boolean>>
  updateTask?: UpdateTask
  deleteTask(id: string): void
  selectActiveTask: (id: string | null) => void
  activeTaskId: string | null
}
export default function CompletedTasks({
  showCompleted,
  completedTasks,
  setShowCompleted,
  updateTask,
  deleteTask,
  selectActiveTask,
  activeTaskId,
}: Props) {
  return (
    <div>
      <div className="max-w-7xl mt-4 mx-auto px-8 flex items-center">
        {!showCompleted && completedTasks.length > 0 && (
          <h1
            className="font-semibold text-gray-400 text-sm cursor-pointer hover:text-black"
            onClick={() => setShowCompleted(true)}
          >
            Show Completed&nbsp;({completedTasks.length})
          </h1>
        )}
        {showCompleted && (
          <div
            className="flex items-center justify-center cursor-pointer"
            onClick={() => setShowCompleted(false)}
          >
            <h1 className="text-lg font-semibold text-gray-900">Completed</h1>
            <div className="ml-2 h-5 w-5 flex items-center hover:from-indigo-300">
              {<ChevronDownIcon />}
            </div>
          </div>
        )}
      </div>
      {showCompleted && (
        <div className="py-4">
          {completedTasks.map((task) => {
            return (
              <div key={task.id}>
                <TaskListItem
                  key={task.id}
                  task={task}
                  updateTask={updateTask}
                  deleteTask={deleteTask}
                  selectActiveTask={selectActiveTask}
                  activeTaskId={activeTaskId}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
