import { Task } from '../types'
import TaskListItem from './TaskListItem'

type Props = {
  tasks: Task[]
  updateTask({
    id,
    actualEndDate,
  }: {
    id: string
    actualEndDate?: number
  }): Promise<void>
}
function TaskList({ tasks, updateTask }: Props) {
  return (
    <div className="mx-auto px-8">
      <div className="py-4">
        {tasks.map((task) => {
          return (
            <TaskListItem key={task.id} task={task} updateTask={updateTask} />
          )
        })}
      </div>
    </div>
  )
}

export default TaskList
