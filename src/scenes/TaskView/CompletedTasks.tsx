import { ChevronDownIcon } from '@heroicons/react/outline'
import { Task } from '../../types'
import TaskListItem from './TaskListItem'

type Props = {
  showCompleted: boolean
  completedTasks: Task[]
  setShowCompleted: React.Dispatch<React.SetStateAction<boolean>>
  updateTask: ({
    id,
    actualEndDate,
    name,
    folderId,
    filePaths,
  }: {
    id: string
    actualEndDate?: number | null | undefined
    name?: string | undefined
    folderId?: string | undefined
    filePaths?: string[] | undefined
  }) => Promise<void>
  deleteTask(id: string): Promise<void>
  selectActiveTask: (id: string | null) => void
  activeTaskId: string | null
  moveTask: (taskId: string, direction: 'UP' | 'DOWN') => Promise<void>
}
export default function CompletedTasks({
  showCompleted,
  completedTasks,
  setShowCompleted,
  updateTask,
  deleteTask,
  selectActiveTask,
  activeTaskId,
  moveTask,
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
          <>
            <h1 className="text-lg font-semibold text-gray-900">Completed</h1>
            <div
              className="ml-2 h-5 w-5 flex items-center cursor-pointer hover:from-indigo-300"
              onClick={() => setShowCompleted(false)}
            >
              {<ChevronDownIcon />}
            </div>
          </>
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
                  moveTask={moveTask}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
