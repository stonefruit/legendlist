import { Task } from '../types'

type Props = {
  tasks: Task[]
}
function TaskList({ tasks }: Props) {
  return (
    <div className="mx-auto px-8">
      <div className="py-4">
        {tasks.map((task) => {
          return <div key={task.id}>{task.name}</div>
        })}
      </div>
    </div>
  )
}

export default TaskList
