import { Task } from '../types'
import TaskListItem from './TaskListItem'

type Props = {
  tasks: Task[]
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
function TaskList({
  tasks,
  updateTask,
  activeTaskId,
  selectActiveTask,
}: Props) {
  return (
    <div className="mx-auto">
      <div className="py-4">
        {tasks.map((task) => {
          return (
            <TaskListItem
              key={task.id}
              task={task}
              updateTask={updateTask}
              selectActiveTask={selectActiveTask}
              activeTaskId={activeTaskId}
            />
          )
        })}
      </div>
    </div>
  )
}

export default TaskList
