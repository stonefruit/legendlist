import { Task } from '../types'
import TaskListItem from './TaskListItem'

type Props = {
  tasks: Task[]
}
function TaskList({ tasks }: Props) {
  return (
    <div className="mx-auto px-8">
      <div className="py-4">
        {tasks.map((task) => {
          return <TaskListItem key={task.id} task={task} />
        })}
      </div>
    </div>
  )
}

export default TaskList
